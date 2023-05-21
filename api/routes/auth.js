const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// All users (remove after testing)
router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Login user
router.get('/', async (req, res) => {
  // get email and password from body
  const email = req.body.email;
  const password = req.body.password;
  if (email == null) {
    return res.status(400).json({ message: "email is required" });
  }
  if (password == null) {
    return res.status(400).json({ message: "password is required" });
  }
  // check that credentials are correct
  try {
    const users = await User.find({ email: email, password: password});
    if (users.length == 0) {
      return res.status(400).json({ message: "credentials are incorrect" });
    }
    // return user id
    return res.status(200).json({ user_id: users.at(0)._id });
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
});

// Sign up / Create user
router.post('/', async (req, res) => {
  // get email and password from body
  const email = req.body.email;
  const password = req.body.password;
  if (email == null) {
    return res.status(400).json({ message: "email is required" });
  }
  if (password == null) {
    return res.status(400).json({ message: "password is required" });
  }
  try {
    // check that email is unique 
    const users = await User.find({ email: email });
    if (users.length > 0) {
      return res.status(400).json({ message: "email already exists" });
    }
    // create user
    const user = new User({
      email: email,
      password: password,
      notes: [],
      tags: [] 
    });
    const newUser = await user.save();
    // return user id
    return res.status(201).json(newUser._id);
  } catch (err) {
    return res.status(500).json({ message: err.message });
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
      return res.status(400).json({ message: "email not found" });
    }
    users.at(0).deleteOne();
    // return user id
    return res.status(200).json({ message: "user deleted"});
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;