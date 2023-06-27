const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const mongoose = require('mongoose');
const getUser = require('../middleware/getUser.js');


// Get all notes
router.get('/:id', getUser,(req, res) => {
  // get user id from getUser
  const user = res.user;
  try {
    // sort by created date
    user.notes.sort((a, b) => {
      if (a === b) {
        return 0;
      }
      return a.created < b.created ? 1 : -1;
    });
    // return notes
    return res.status(200).json( user.notes);
  } catch(err) {
    return res.status(500).json({ message: err.message });
  }
});

// Create one note
router.post('/:id', getUser, async (req, res) => {
  // Get user id from getUser
  const user = res.user;
  // Get note data from body
  const noteTitle = req.body.title;
  const noteContent = req.body.content;
  const noteTags = req.body.tags;
  // check that the required vars are set
  if (noteTitle == null) {
    return res.status(400).json({ message: "title is required" });
  }
  if (noteContent == null) {
    return res.status(400).json({ message: "content is required" });
  }
  if (noteTags == null) {
    return res.status(400).json({ message: "tags are required" });
  }
  let note = {
    title: noteTitle,
    content: noteContent,
    tags: noteTags
  };
  try {
    // create note in db
    user.notes.push(note);
    const newUser = await user.save();
    // sort by created date
    user.notes.sort((a, b) => {
      if (a === b) {
        return 0;
      }
      return a.created < b.created ? 1 : -1;
    });
    // Get the note that was created
    const addedNote = newUser.notes.find((n) => n.title === noteTitle && n.content === noteContent);
    // return created note
    return res.status(201).json(addedNote);
  } catch(err) {
    return res.status(500).json({ message: err.message });
  }
});

// Update one note
router.patch('/:id', getUser, async (req, res) => {
  // Get user id from getUser
  const user_id = res.user._id;
  // Get note data from body
  const note_id = req.body.note_id;
  const newTitle = req.body.title;
  const newContent = req.body.content;
  const newTags = req.body.tags;
  // check that the required vars are set
  if (note_id == null) {
    return res.status(400).json({ message: "note id is required" });
  }
  if (newTitle == null) {
    return res.status(400).json({ message: "title is required" });
  }
  if (newContent == null) {
    return res.status(400).json({ message: "content is required" });
  }
  if (newTags == null) {
    return res.status(400).json({ message: "tags is required" });
  }
  try {
    // Check if note exists
    const note = await User.findOne({ _id: user_id, 'notes._id': note_id });
    if (!note) {
      return res.status(400).json({ message: "note not found" });
    }
    // update note data in db
    const modifiedDate = Date.now();
    const user = await User.findOneAndUpdate(
      { _id: user_id, 'notes._id': note_id },
      { $set: { 
        'notes.$.title': newTitle,  
        'notes.$.content': newContent,
        'notes.$.tags': newTags, 
        'notes.$.modified': modifiedDate 
      } }, { new: true } 
    );
    // return modifiedDate
    return res.status(202).json(modifiedDate);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Update many notes (only tags property)
router.patch('/tags/:id', getUser, async (req, res) => {
  // Get user id from getUser
  const user_id = res.user._id;
  // Get log of all the notes that need to be updated
  const editLog = req.body;
  // check that the required vars are set
  if (editLog == null) {
    return res.status(400).json({ message: "note changes required" });
  }
  try {
    // loop over individual edits that should be made
    for (let edit of editLog) {
      const note_id = edit.note_id;
      const tag_id = edit.tag_id;
      const newName = edit.name;
      // check that the required vars are set per edit
      if (note_id == null) {
        return res.status(400).json({ message: "note changes required" });
      }
      if (tag_id == null) {
        return res.status(400).json({ message: "note changes required" });
      }
      if (newName == null) {
        return res.status(400).json({ message: "note changes required" });
      }
      // Check if note exists
      const note = await User.findOne({ _id: user_id, 'notes._id': note_id });
      if (!note) {
        return res.status(400).json({ message: "note not found" });
      }
      // update note data in db
      await User.findOneAndUpdate(
        { _id: user_id, 'notes._id': note_id, 'notes.tags._id': tag_id }, // Match the user and note IDs
        {
          $set: {
            'notes.$[note].tags.$[tag].name': newName
          }
        }, // Update the title and content of the matched note
        {
          new: true,
          arrayFilters: [
            { 'note._id': note_id },
            { 'tag._id': tag_id }
          ]
        }
      );
    }
    // return status
    return res.status(202).json("Notes updated");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Delete one note
router.delete('/:id', getUser, async (req, res) => {
  // Get user id from getUser
  const user_id = res.user._id;
  // Get note id from body
  const note_id = req.body.note_id;
  // check that the required vars are set
  if (note_id == null) {
    return res.status(400).json({ message: "note id is required" });
  }
  // Check if note exists
  const note = await User.findOne({ _id: user_id, 'notes._id': note_id });
  if (!note) {
    return res.status(400).json({ message: "note cannot be found" });
  }
  // delete note from db
  try {
    await User.findOneAndUpdate(
      { _id: user_id },
      { $pull: { notes: { _id: note_id } } },
      { new: true }
    );
    // return statues
    return res.status(202).json("Note deleted");
  } catch(err) {
    return res.status(500).json({ message: err.message });
  }
});

// Delete many note tags
router.delete('/tags/:id', getUser, async (req, res) => {
  // Get user id and note id
  const user_id = res.user._id;
  const editLog = req.body;
  // check that the required vars are set
  if (editLog == null) {
    return res.status(400).json({ message: "note changes required" });
  }
  try {
    // Loop through delete requests
    for (let edit of editLog) {
      const note_id = edit.note_id;
      const tag_id = edit.tag_id;
      // check that the required vars are set per delete request
      if (note_id == null) {
        return res.status(400).json({ message: "note id required" });
      }
      if (tag_id == null) {
        return res.status(400).json({ message: "tag id required" });
      }
      // Check if note exists
      const note = await User.findOne({ _id: user_id, 'notes._id': note_id });
      if (!note) {
        return res.status(400).json({ message: "note not found" });
      }
      // Delete tag from tags property of a note in db
      await User.findOneAndUpdate(
        {
          _id: user_id,
          'notes._id': note_id
        },
        {
          $pull: {
            'notes.$.tags': { _id: tag_id }
          }
        },
        {
          new: true
        }
      );
    }
    // return status
    return res.status(202).json("Notes deleted");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;