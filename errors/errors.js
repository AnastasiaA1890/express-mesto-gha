const error = (err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  res.status(500).send({ message: '500 - Ошибка п умолчанию' });
  return next();
};

module.exports = error;
