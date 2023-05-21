const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true,
  },
  modified: {
    type: Date,
    default: Date.now,
    required: true
  },
  tags: [tagSchema],
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true, 
  },
  password: {
    type: String,
    required: true
  },
  notes: [noteSchema],
  tags: [tagSchema]
});

module.exports = mongoose.model('user', userSchema);