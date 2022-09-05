const userRouter = require('express').Router();
const { validateUserId, validateProfileUpdate, validateAvatar } = require('../middlewares/validators');
const {
  getUser, getUserById, updateAvatar, updateProfile, getUserInfo,
} = require('../controllers/user');

userRouter.get('/', getUser);

userRouter.get('/me', getUserInfo);

userRouter.get('/:userId', validateUserId, getUserById);

userRouter.patch('/me/avatar', validateAvatar, updateAvatar);

userRouter.patch('/me', validateProfileUpdate, updateProfile);

module.exports = userRouter;
