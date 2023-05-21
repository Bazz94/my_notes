const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const mongoose = require('mongoose');


// Get 100 notes
router.get('/', getUser,(req, res) => {
  // get user id and which 30 notes to send
  const user = res.user;
  let notesBlock = req.body.block;
  if (notesBlock == null) {
    notesBlock = 0;
  }
  try {
    // sort by created date
    user.notes.sort((a, b) => {
      if (a === b) {
        return 0;
      }
      return a.created < b.created ? -1 : 1;
    });
    // limit by 100 notes
    const limitedNotes = user.notes.slice(notesBlock * 100, (notesBlock + 1) *  100);
    // return 100 notes
    return res.status(200).send(limitedNotes);
  } catch(err) {
    return res.status(500).json({ message: err.message });
  }
});

// Create one note
router.post('/', getUser, async (req, res) => {
  // Get user id and note data
  const user = res.user;
  const noteTitle = req.body.title;
  const noteContent = req.body.content;
  let noteTags = req.body.tags;
  if (noteTitle == null) {
    return res.status(400).json({ message: "note title is required" });
  }
  if (noteContent == null) {
    return res.status(400).json({ message: "note content is required" });
  }
  if (noteTags == null) {
    noteTags = [];
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
    // get note that was created
    const addedNote = newUser.notes.find((n) => n.title === noteTitle && n.content === noteContent);

    // return status
    return res.status(201).send(addedNote._id);
  } catch(err) {
    return res.status(500).json({ message: err.message });
  }
});

// Update one note
router.patch('/', getUser, async (req, res) => {
  // Get user id and note id
  const user_id = res.user._id;
  const note_id = req.body.note_id;
  if (note_id == null) {
    return res.status(400).json({ message: "note id is required" });
  }
  const newTitle = req.body.title;
  const newContent = req.body.content;
  const newTags = req.body.tags;
  try {
    // Check if note exists
    const note = await User.findOne({ _id: user_id, 'notes._id': note_id });
    if (!note) {
      return res.status(400).json({ message: "note cannot be found" });
    }
    // update note data in db
    let updatedUser;
    if (newTitle != null && newContent != null) {
      updatedUser = await User.findOneAndUpdate(
        { _id: user_id, 'notes._id': note_id }, // Match the user and note IDs
        { $set: { 
          'notes.$.title': newTitle,  
          'notes.$.modified': Date.now() 
        } }, // Update the title and content of the matched note
        { new: true } // Return the updated user object
      );
    }
    if (newContent != null) {
      updatedUser = await User.findOneAndUpdate(
        { _id: user_id, 'notes._id': note_id }, // Match the user and note IDs
        { $set: { 
          'notes.$.content': newContent, 
          'notes.$.modified': Date.now() 
        } }, // Update the title of the matched note
        { new: true } // Return the updated user object
      );
    }
    if (newTags != null) {
      updatedUser = await User.findOneAndUpdate(
        { _id: user_id, 'notes._id': note_id }, // Match the user and note IDs
        { $set: { 
          'notes.$.tags': newTags, 
          'notes.$.modified': Date.now() 
        } }, // Update the title of the matched note
        { new: true } // Return the updated user object
      );
    }
    if (updatedUser === undefined) {
      return res.status(400).json({ message: "no data has been provided" });
    }
    const updatedNote = updatedUser.notes.id(note_id);
    // return status
    return res.status(202).json(updatedNote);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Delete one note
router.delete('/', getUser, async (req, res) => {
  // Get user id and note id
  const user_id = res.user._id;
  const note_id = req.body.note_id;
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
    return res.status(201).json({ message: "delete successful" });
  } catch(err) {
    return res.status(500).json({ message: err.message });
  }
  // return status
});

async function getUser(req, res, next) {
  let user;
  if (req.body.user_id == null) {
    return res.status(400).json({ message: "user id is required" });
  }
  try {
    user = await User.findById(req.body.user_id);
    if(user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch(err) {
    return res.status(500).json({message : err.message});
  }
  res.user = user;
  next(); 
}

module.exports = router;