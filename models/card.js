const mongoose = require('mongoose');
//const userSchema = require('./user');
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    length: 30
  },
  link: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userSchema,
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: undefined
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('card', cardSchema);
