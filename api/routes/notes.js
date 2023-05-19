const express = require('express');
const router = express.Router();

// Get 30 notes
router.get('/:user_id', (req, res) => {
  // get user id and which 30 notes to send
  // return 30 notes
  res.status(200).send('test successful');
});

// Create one note
router.post('/:user_id', (req, res) => {
  // Get user id and note data
  // create note in db
  // return status
});

// Update one note
router.patch('/:user_id', (req, res) => {
  // Get user id and note id
  // update note data in db
  // return status
});

// Delete one note
router.delete('/:user_id', (req, res) => {
  // Get user id and note id
  // delete note from db
  // return status
});

module.exports = router;