// models/todoSchema.js
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  roomCode: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;