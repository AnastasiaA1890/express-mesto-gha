const Card = require('../models/card');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');
const { DeclinePermission } = require('../errors/DeclinePermission');

const getCard = (_, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 - Переданы некорректные данные в методы создания карточки'));
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      const owner = card.owner.toHexString();
      if (!card) {
        next(new NotFoundError('404 - Карточка с указанным id не найдена'));
      } else if (owner === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .orFail(new Error('NoValidId'))
          .then((cardDeleted) => res.send(cardDeleted))
          .catch((err) => {
            if (err.message === 'NoValidId') {
              next(new NotFoundError('404 - Карточка с указанным _id не найдена.'));
            } else {
              next(err);
            }
          });
      } else {
        next(new DeclinePermission('403 — Попытка удалить чужую карточку'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('400 —  Карточка с указанным _id не найдена'));
      } else if (err.name === 'TypeError') {
        next(new NotFoundError('404 - Удаление карточки с несуществующим в БД id'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('404 - Передан несуществующий _id карточки.'));
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 - Переданы некорректные данные для постановки/снятии лайка.'));
        return;
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('404 - Передан несуществующий _id карточки.'));
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 - Переданы некорректные данные для постановки/снятии лайка.'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
