const User = require('../models/user.js');
const mongoose = require('mongoose');

// handles getting the user from the user id pram
async function getUser(req, res, next) {
  let user;
  // check that the required vars are set
  if (req.params.id == null) {
    return res.status(400).json({ message: "user id is required" });
  }
  // find user with user id
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'user not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  // return user
  res.user = user;
  next();
}

module.exports = getUser;