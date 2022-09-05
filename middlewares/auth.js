const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const isAuthorized = (req, res, next) => {
  let payload;

  const auth = req.headers.authorization;

  if (!auth) {
    throw new Unauthorized('Необходима авторизация');
  }

  const token = auth.replace('Bearer ', '');

  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    throw new Unauthorized('Необходима авторизация');
  }

  req.user = payload;
  next();
};

module.exports = isAuthorized;
