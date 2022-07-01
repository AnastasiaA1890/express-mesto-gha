const userRouter = require('express').Router();
const {createUser} = require('../controllers/user')
// userRouter.get('/users', (req, res) => {
//   User.find({})
//     .then((users) => {
//       res.send({data: users})
//     })
//     .catch(() => {
//       res.status(500).send({ message: 'Произошла ошибка' })
//     });
// });
//
// userRouter.get('/users/:userId', (req, res) => {
//   if(!User[req.params.id]){
//     res.send({ error: 'Такого пользователя нет' })
//     return
//   } res.send(User[req.params.id])
// })

userRouter.post('/', createUser)

module.exports = userRouter;
