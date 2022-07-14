const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(bodyParser.json());// для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', userRouter);
app.use('/cards', auth, cardRouter);
app.use((req, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});
app.listen(PORT);
