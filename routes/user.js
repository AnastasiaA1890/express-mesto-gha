const userRouter = require('express').Router();
const {
  createUser, getUser, getUserById, updateAvatar, updateProfile,
} = require('../controllers/user');

userRouter.get('/', getUser);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me/avatar', updateAvatar);
userRouter.patch('/me', updateProfile);

module.exports = userRouter;
