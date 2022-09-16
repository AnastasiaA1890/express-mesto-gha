const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');
const { secretKey } = require('../const/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }
  req.user = payload;

  next();
};
