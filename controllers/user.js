const User = require('../models/user');
const ERROR_CODE = 400;

const getUser = (req, res) => {
  User.find({})
    .then((user) => {
      res.send({data: user})
    })
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}))
}

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if(!user) {
        res.status(404).send({message: 'Пользователь по указанному id не найден'})
      } res.send({data: user})
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({message: 'Отправлены некорректные данные'})
      }
    })
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}))
}

const createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({message: 'Переданы некорректные данные при создании пользователя.'})
      }
    })
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}));
}

const updateProfile = (req, res) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about}, {new: true, runValidators: true})
    .then((user) => {
      if(!user) {
        res.status(404).send({message: `Пользователь по указанному _id не найден.`})
      } else {
        res.send({data: user})
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE).send({message: 'Переданы некорректные данные при обновлении профиля.'})
    })
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}))
}

const updateAvatar = (req, res) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar}, {new: true, runValidators: true})
    .then(user => res.send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE).send({message: 'Переданы некорректные данные в методы обновления аватара'})
    })
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}))
}

module.exports = {
  getUser,
  getUserById,
  createUser,
  updateAvatar,
  updateProfile
}
