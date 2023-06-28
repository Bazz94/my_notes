const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Mongoose = require('mongoose');
const getUser = require('../middleware/getUser.js');

// Get all tags
router.get('/:id', getUser, async (req, res) => {
  // get user from getUser
  const user = res.user;
  try {
    // return users tags
    return res.status(200).json(user.tags);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Create one tag
router.post('/:id', getUser, async (req, res) => {
  // get user from getUser
  const user = res.user;
  // get name from body
  const name = req.body.name;
  // check that the required vars are set
  if (name == null) {
    return res.status(400).json({ message: "tag data is required" });
  }
  const tagData = {
    name: name,
    selected: false
  };
  // Check if name is already used
  const tag = user.tags.find((item) => item.name === name);
  if (tag != undefined) {
    return res.status(400).json({ message: "duplicate name" });
  }
  try {
    // Create tag in db
    user.tags.push(tagData);
    const newUser = await user.save();
    const newTag = newUser.tags.find((item) => item.name === name)
    // return tag id
    return res.status(201).json(newTag._id);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Update one tag
router.patch('/:id', getUser,  async (req, res) => {
  // Get user from getUser
  const user = res.user;
  // Get tag data from body
  const {id, name, selected} = req.body;
  // check that the required vars are set
  if (id == null) {
    return res.status(400).json({ message: "tag id is required" });
  }
  if (name == null && selected == null) {
    return res.status(400).json({ message: "tag data is required" });
  }
  try {
    // Check if id exists
    const tag = user.tags.find((item) => item._id == id);
    if (tag === undefined) {
      return res.status(400).json({ message: "tag does not exist" });
    }
    if (name != null) {
      // Update tag name
      tag.name = name;
    }
    if (selected != null) {      
      // Update tag in the note.tags data in db
      if (selected === true){
        user.tags.forEach((item) => {
          item.selected = false;
        });
      }
      tag.selected = selected;
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
  // get user from getUser
  const user = res.user;
  // get tag id from body
  const id = req.body.id;
  // check that the required vars are set
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

module.exports = router;