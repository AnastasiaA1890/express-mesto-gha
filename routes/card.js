const cardRouter = require('express').Router();

const {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

cardRouter.get('/', getCard);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardRouter;
