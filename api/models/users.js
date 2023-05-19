const mongoose = require('mongoose');

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

const notesSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true },
  content: { 
    type: Number, 
    required: true },
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

const tagsSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
  },
});

// make email, password and create data read only
userSchema.pre('save', function (next) {
  // Check if the immutableField has been modified
  if (this.isModified('email')) {
    return next(new Error('email cannot be modified.'));
  }
  next();
  
  // Check if the immutableField has been modified
  if (this.isModified('password')) {
    return next(new Error('password cannot be modified.'));
  }
  next();
});

notesSchema.pre('save', function (next) {
  // Check if the immutableField has been modified
  if (this.isModified('created')) {
    return next(new Error('created date cannot be modified.'));
  }
  next();
});

module.exports = mongoose.model('user', userSchema);