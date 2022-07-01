const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRouter = require('./routes/user');
const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/mestodb')
app.use(bodyParser.json());// для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', userRouter);
app.listen(PORT)

