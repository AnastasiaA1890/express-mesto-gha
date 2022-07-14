const userRouter = require('express').Router();
const {
  getUser, getUserById, updateAvatar, updateProfile,
} = require('../controllers/user');

userRouter.get('/', getUser);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me/avatar', updateAvatar);
userRouter.patch('/me', updateProfile);

module.exports = userRouter;
