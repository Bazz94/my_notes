const express = require('express');
const router = express.Router();
const User = require('../models/users.js');

// All users (remove after testing)
router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login user
router.get('/', async (req, res) => {
  // get email and password from body
  const email = req.body.email;
  const password = req.body.password;
  if (email == null) {
    res.status(400).json({ message: "email is required" });
  }
  if (password == null) {
    res.status(400).json({ message: "password is required" });
  }
  // check that credentials are correct
  try {
    const users = await User.find({ email: email, password: password});
    if (users.length == 0) {
      res.status(400).json({ message: "credentials are incorrect" });
    }
    // return user id
    res.status(200).json({ user_id: users.at(0)._id });
  } catch (err) {
    res.status(500).json({message: err.message});
  }
  
});

// Create user
router.post('/', async (req, res) => {
  // get email and password from body
  const email = req.body.email;
  const password = req.body.password;
  // check that email is unique 
  try {
    // create user
    const user = new User({
      email: email,
      password: password,
      notes: [],
      tags: [] 
    });
    const newUser = await user.save();
    // return user id
    res.status(201).json(newUser._id);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user
router.delete('/', async (req, res) => {
  // get email and password from body
  const email = req.body.email;
  // check that email is unique 
  try {
    const users = await User.find({ email: email });
    if (users.length == 0) {
      res.status(400).json({ message: "email not found" });
    }
    users.at(0).deleteOne();
    // return user id
    res.status(200).json({ message: "user deleted"});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;