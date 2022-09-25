const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const DeclinePermission = require('../errors/DeclinePermission');

const getCard = (_, res, next) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('400 - Incorrect data passed to card creation methods'));
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(new NotFoundError('The card with the specified _id was not found.'))
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        next(new DeclinePermission('Another card cannot be deleted.'));
      } else {
        Card.deleteOne(card)
          .then(() => res.status(200).send({ message: `Card with id ${card.id} has been deleted successfully!` }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Request error.'));
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
    .orFail(new NotFoundError('404 - A non-existent _id of the card was passed.'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'ValidationError') {
        next(new ValidationError('400 - Incorrect data was sent to like/dislike the card.'));
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
    .orFail(new NotFoundError('404 - A non-existent _id of the card was passed.'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'ValidationError') {
        next(new ValidationError('400 - Incorrect data was sent to like/dislike the card.'));
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
