const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const notesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: Number,
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
  tags: [tagsSchema],
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
  notes: [notesSchema],
  tags: [tagsSchema]
});

module.exports = mongoose.model('user', userSchema);