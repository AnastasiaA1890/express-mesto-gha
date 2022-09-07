/* const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

let payload;

const isAuthorized = (req, res, next) => {
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

module.exports = { isAuthorized }; */
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');
const { secretKey } = require('../const/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Необходима авторизация 111'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    next(new Unauthorized('Необходима авторизация 222'));
  }
  req.user = payload;

  next();
};
