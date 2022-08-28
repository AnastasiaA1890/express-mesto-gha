const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../errors/Unauthorized');

let payload;

const isAuthorized = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('401 - Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new Unauthorized('401 - Необходима авторизация'));
    return;
  }
  req.user = payload;
  next();
};

module.exports = {
  isAuthorized,
};
