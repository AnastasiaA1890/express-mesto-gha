const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.get('/users', (req, res) => {
  User.find({})
    .then((users) => {
      res.send({data: users})
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' })
    });
});

userRouter.get('/users/:userId', (req, res) => {
  if(!User[req.params.id]){
    res.send({ error: 'Такого пользователя нет' })
    return
  } res.send(User[req.params.id])
})

userRouter.post('/users', (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then((user) => {
      res.send({data: user})
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' })
    });
})

module.exports = userRouter;
