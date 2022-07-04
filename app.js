const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
app.use(bodyParser.json());// для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '62c0f519ba8f25bdb9880df7' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});
app.listen(PORT)

