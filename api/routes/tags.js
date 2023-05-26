const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Mongoose = require('mongoose');

// Get all tags
router.get('/:id', getUser, async (req, res) => {
  const user = res.user;
  try {
    // return tags
    return res.status(200).json(user.tags);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Create one tag
router.post('/:id', getUser, async (req, res) => {
  const user = res.user;
  const newName = req.body.name;
  if (newName == null) {
    return res.status(400).json({ message: "tag name is required" });
  }
  const tagData = {
    name: newName,
    selected: false
  };
  const tag = user.tags.find((item) => item.name === newName);
  if (tag != undefined) {
    return res.status(400).json({ message: "duplicate name" });
  }
  try {
    // Check that name is unique
    // Create tag in db
    user.tags.push(tagData);
    const newUser = await user.save();
    const newTag = newUser.tags.find((item) => item.name === newName)
    // return tag id
    return res.status(201).json(newTag._id);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Update one tag
router.patch('/:id', getUser,  async (req, res) => {
  const user = res.user;
  // Get tag id
  const id = req.body.id;
  //const mId = new Mongoose.Types.ObjectId(id);
  const newName = req.body.name;
  const newSelected = req.body.selected;
  if (id == null) {
    return res.status(400).json({ message: "tag id is required" });
  }
  if (newName == null && newSelected == null) {
    return res.status(400).json({ message: "tag data is required" });
  }
  try {
    // Check if id exists
    const tag = user.tags.find((item) => item._id == id);
    if (tag === undefined) {
      return res.status(400).json({ message: "tag does not exist" });
    }
    if (newName != null) {
      // Update tag name
      tag.name = newName;
    }
    if (newSelected != null) {      
      // Update tag data in db
      if (newSelected === true){
        user.tags.forEach((item) => {
          item.selected = false;
        });
      }
      tag.selected = newSelected;
    }
    const newUser = await user.save();
    // return status
    return res.status(202).json("Tag updated");
  } catch(err) {
    return res.status(500).json({ message: err.message });
  }
});

// Delete one tag
router.delete('/:id', getUser, async (req, res) => {
  // Get tag id
  const user = res.user;
  const id = req.body.id;
  if (id == null) {
    return res.status(400).json({ message: "tag id is required" });
  }
  try {
    // Check if id exists
    const tag = user.tags.find((item) => item._id == id);
    if (tag === undefined) {
      return res.status(400).json({ message: "tag does not exist" });
    }
    // Delete tag in db
    user.tags = user.tags.filter((item) => item._id !== tag._id);
    const newUser = await user.save();
    // return status
    return res.status(202).json("Tag deleted");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let user;
  if (req.params.id == null) {
    return res.status(400).json({ message: "user id is required" });
  }
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'user not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

module.exports = router;