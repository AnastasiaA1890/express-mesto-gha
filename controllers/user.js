const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const Unauthorized = require('../errors/Unauthorized');

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      next(new Unauthorized(err.message));
    });
};

const getUser = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера.' }));
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user)
    .onFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Пользователь по указанному id не найден.'));
      } else if (err.name === 'NotFound') {
        next(new NotFoundError('404 - Пользователь по указанному id не найден.'));
      } else {
        next(err);
      }
    });
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .onFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Пользователь по указанному id не найден.'));
      } else if (err.name === 'NotFound') {
        next(new NotFoundError('404 - Пользователь по указанному id не найден.'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    next(new ValidationError('Email или password не могут быть пустыми'));
  }

  User.findOne({ email })
    .then((usr) => {
      if (usr) {
        next(new ConflictError('409 - Пользователь с такой почтой уже существует'));
      } else {
        bcrypt
          .hash(password, 10)
          .then((hash) => User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          }))
          .then((user) => res.status(201).send(user.toJSON()))
          .catch((err) => {
            if (err.code === 11000) {
              next(new ConflictError('409 - Пользователь с такой почтой уже существует'));
            } else if (err.name === 'MongoError' && err.name === 'ValidationError') {
              next(new ValidationError('400 - Переданы некорректные данные при создании пользователя.'));
            } else {
              next(err);
            }
          });
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  if (!name || !about) {
    next(new NotFoundError('404 - Переданы некорректные данные при обновлении профиля.'));
    return;
  }

  User
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 - Переданы некорректные данные при обновлении профиля.'));
        return;
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  if (!avatar) {
    next(new NotFoundError('404 - Переданы некорректные данные при обновлении аватара.'));
    return;
  }

  User
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 - Переданы некорректные данные при обновлении аватара.'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getUser,
  getUserById,
  createUser,
  updateAvatar,
  updateProfile,
  login,
  getUserInfo,
};
