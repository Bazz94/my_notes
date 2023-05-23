const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  selected: {
    type: Boolean,
  }
});

module.exports = mongoose.model('tag', tagSchema);