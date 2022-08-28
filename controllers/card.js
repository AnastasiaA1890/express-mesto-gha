const Card = require('../models/card');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');

const getCard = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 - Переданы некорректные данные в методы создания карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('404 - Карточка с указанным _id не найдена.'));
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 - Отправлены некорректные данные'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 - Переданы некорректные данные для постановки/снятии лайка.'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 - Переданы некорректные данные для постановки/снятии лайка.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
