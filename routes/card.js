const cardRouter = require('express').Router();

const { validateCreateCard, validateCardsId } = require('../middlewares/validators');

const {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

cardRouter.get('/', getCard);

cardRouter.post('/', validateCreateCard, createCard);

cardRouter.delete('/:cardId', validateCardsId, deleteCard);

cardRouter.put('/:cardId/likes', validateCardsId, likeCard);

cardRouter.delete('/:cardId/likes', validateCardsId, dislikeCard);

module.exports = cardRouter;
