const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

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

// methods
userSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')){
    return next();
  } 
  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  next();
});

userSchema.methods.comparePassword = async (hash, candidatePassword) => {
  return await bcrypt.compare(candidatePassword, hash);
};

module.exports = mongoose.model('user', userSchema);