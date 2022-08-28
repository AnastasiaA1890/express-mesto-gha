const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regex } = require('../const/constants');

const {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

cardRouter.get('/', getCard);

cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regex),
  }),
}), createCard);

cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required().length(24),
  }),
}), deleteCard);

cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required().length(24),
  }),
}), likeCard);

cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required().length(24),
  }),
}), dislikeCard);

module.exports = cardRouter;
