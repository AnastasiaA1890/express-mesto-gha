const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');

const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const { login, createUser } = require('./controllers/user');
const NotFoundError = require('./errors/NotFoundError');
const error = require('./errors/errors');
const auth = require('./middlewares/auth');
const { validateSignUp, validateSignIn } = require('./middlewares/validators');

const app = express();

app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json());// для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post('/signup', validateSignUp, createUser);
app.post('/signin', validateSignIn, login);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res, next) => {
  next(new NotFoundError('404 - Страницы не существует'));
});

app.use(errors());

app.use(error);

app.listen(PORT);
