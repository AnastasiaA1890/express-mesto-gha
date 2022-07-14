const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ERROR_CODE = 400;

const login = (req, res) => {
  const {
    email, password,
  } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => res.status(401).send({ message: 'Неправильные почта или пароль' }));
};

const getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному id не найден' });
      } res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(ERROR_CODE).send({ message: 'Отправлены некорректные данные' });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
          return res.status(500).send({ message: 'Произошла ошибка' });
        });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные в методы обновления аватара' });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getUser,
  getUserById,
  createUser,
  updateAvatar,
  updateProfile,
  login,
};
