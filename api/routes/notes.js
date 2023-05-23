const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const mongoose = require('mongoose');


// Get notes
router.get('/:id', getUser,(req, res) => {
  // get user id and which 30 notes to send
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
  // Get user id and note data
  const user = res.user;
  const noteTitle = req.body.title;
  const noteContent = req.body.content;
  const noteTags = req.body.tags;
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
    // get note that was created
    const addedNote = newUser.notes.find((n) => n.title === noteTitle && n.content === noteContent);

    // return status
    return res.status(201).json(addedNote._id);
  } catch(err) {
    return res.status(500).json({ message: err.message });
  }
});

// Update one note
router.patch('/:id', getUser, async (req, res) => {
  // Get user id and note id
  const user_id = res.user._id;
  const note_id = req.body.note_id;
  const newTitle = req.body.title;
  const newContent = req.body.content;
  const newTags = req.body.tags;
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
    await User.findOneAndUpdate(
      { _id: user_id, 'notes._id': note_id }, // Match the user and note IDs
      { $set: { 
        'notes.$.title': newTitle,  
        'notes.$.content': newContent,
        'notes.$.tags': newTags, 
        'notes.$.modified': Date.now() 
      } }, // Update the title and content of the matched note
      { new: true } // Return the updated user object
    );
    // return status
    return res.status(202).json("Note updated");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Update many note (only tags)
router.patch('/tags/:id', getUser, async (req, res) => {
  // Get user id and note id
  const user_id = res.user._id;
  const editLog = req.body;
  if (editLog == null) {
    return res.status(400).json({ message: "note changes required" });
  }
  try {
    for (let edit of editLog) {
      const note_id = edit.note_id;
      const tag_id = edit.tag_id;
      const newName = edit.name;
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
    return res.status(202).json("Note deleted");
  } catch(err) {
    return res.status(500).json({ message: err.message });
  }
  // return status
});

// Delete many note tags
router.delete('/tags/:id', getUser, async (req, res) => {
  // Get user id and note id
  const user_id = res.user._id;
  const editLog = req.body;
  if (editLog == null) {
    return res.status(400).json({ message: "note changes required" });
  }
  try {
    for (let edit of editLog) {
      const note_id = edit.note_id;
      const tag_id = edit.tag_id;
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
      // update note data in db
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

async function getUser(req, res, next) {
  let user;
  if (req.params.id == null) {
    return res.status(400).json({ message: "user id is required" });
  }
  try {
    user = await User.findById(req.params.id);
    if(user == null) {
      return res.status(404).json({ message: 'user not found' });
    }
  } catch(err) {
    return res.status(500).json({message : err.message});
  }
  res.user = user;
  next(); 
}

module.exports = router;