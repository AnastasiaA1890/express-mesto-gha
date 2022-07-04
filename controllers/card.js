const Card = require('../models/card');
const ERROR_CODE = 400;

const getCard = (req, res) => {
  Card.find({})
    //.populate('user')
    .then(card => res.send({data: card}))
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}))
}

const createCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({name, link, owner: req.user._id})
    .then(card => res.send({data: card}))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE).send({message: 'Переданы некорректные данные в методы создания карточки'})
    })
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}))
}

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if(!card) {
        res.status(404).send({message: 'Карточка с указанным _id не найдена.'})
      } res.send({data: card})
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({message: 'Отправлены некорректные данные'})
      }
    })
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}))
}

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {$addToSet: {likes: req.user._id}}, {new: true})
    .then((card) => {
      if(!card) {
        res.status(404).send({message: 'Передан несуществующий _id карточки.'})
      } res.send({data: card})
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({message: 'Переданы некорректные данные для постановки/снятии лайка.'})
      }
    })
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}))
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {$pull: {likes: req.user._id}}, {new: true})
    .then((card) => {
      if(!card) {
        res.status(404).send({message: 'Передан несуществующий _id карточки.'})
      } res.send({data: card})
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({message: 'Переданы некорректные данные для постановки/снятии лайка.'})
      }
    })
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}))
}

module.exports = {
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}
