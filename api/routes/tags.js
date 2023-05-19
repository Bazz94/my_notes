const express = require('express');
const router = express.Router();

// Get all tags
router.get('/:user_id', (req, res) => {
  // Get user id 
  // return all user tags
});

// Create one tag
router.post('/:user_id', (req, res) => {
  // Get user id 
  // Create tag in db
  // return tag id
});

// Update one tag
router.patch('/:user_id', (req, res) => {
  // Get user id and tag id
  // Update tag data in db
  // return status
});

// Delete one tag
router.delete('/:user_id', (req, res) => {
  // Get user id and tag id
  // Delete tag in db
  // return status
});

module.exports = router;