const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const DeclinePermission = require('../errors/DeclinePermission');

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
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        next(new DeclinePermission('Чужую карточку нельзя удалить.'));
      } else {
        Card.deleteOne(card)
          .then(() => res.status(200).send({ message: `Карточка с id ${card.id} успешно удалена!` }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Ошибка в запросе.'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('404 - Передан несуществующий _id карточки.'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'ValidationError') {
        next(new ValidationError('400 - Переданы некорректные данные для постановки/снятии лайка.'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('404 - Передан несуществующий _id карточки.'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'ValidationError') {
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
