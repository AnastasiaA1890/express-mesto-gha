const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, getUserById, updateAvatar, updateProfile, findUser,
} = require('../controllers/user');
const { regex } = require('../const/constants');

userRouter.get('/', getUser);
userRouter.get('/me', findUser);

userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().required().length(24),
  }),
}), getUserById);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regex),
  }),
}), updateAvatar);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

module.exports = userRouter;
