const express = require('express');
const router = express.Router();
const Tag = require('../models/tag.js');

// Get all tags
router.get('/',  async (req, res) => {
  try {
    const tags = await Tag.find();
    // return tags
    return res.status(200).json(tags);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Create one tag
router.post('/', async (req, res) => {
  const newName = req.body.name;
  if (newName == null) {
    return res.status(400).json({ message: "tag name is required" });
  }
  const tagData = {
    name: newName,
    selected: false
  };
  try {
    // Check that name is unique
    const tags = await Tag.find({ name: newName });
    if (tags.length > 0) {
      return res.status(400).json({ message: "duplicate name" });
    }
    // Create tag in db
    const newTag = await Tag.create(tagData);
    // return tag id
    return res.status(201).json(newTag._id);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Update one tag
router.patch('/',  async (req, res) => {
  // Get tag id
  const id = req.body.id;
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
    const tags = await Tag.findById(id);
    if (tags.length > 0) {
      return res.status(400).json({ message: "tag does not exist" });
    }
    if (newName != null) {
      // Update tag data in db
      await Tag.updateOne({_id: id}, {name: newName});
    }
    if (newSelected != null) {      
      // Update tag data in db
      if (newSelected == true){
        await Tag.updateMany({}, { selected: !newSelected }); 
      }
      await Tag.updateOne({ _id: id }, { selected: newSelected });
    }
    // return status
    return res.status(202).json("Tag updated");
  } catch(err) {
    return res.status(500).json({ message: err.message });
  }
});

// Delete one tag
router.delete('/', async (req, res) => {
  // Get tag id
  const id = req.body.id;
  if (id == null) {
    return res.status(400).json({ message: "tag id is required" });
  }
  try {
    // Check if id exists
    const tags = await Tag.findById(id);
    if (tags.length > 0) {
      return res.status(400).json({ message: "tag does not exist" });
    }
    // Delete tag in db
    await Tag.deleteOne({ _id: id });
    // return status
    return res.status(202).json("Tag deleted");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;