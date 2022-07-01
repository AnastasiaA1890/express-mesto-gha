const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRouter = require('./routes/user');

mongoose.connect('mongodb://localhost:27017/mestodb')

app.use('/users', userRouter)

app.listen(3000)

