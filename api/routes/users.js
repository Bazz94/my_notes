const express = require('express');
const router = express.Router();

// Get All
router.get('/', (req, res) => {
  res.status(200).send('hello');
});

// Get one
router.get('/:id,', (req, res) => {
  
});

// Create one
router.post('/,', (req, res) => {

});

// Update one
router.patch('/:id,', (req, res) => {

});

// Delete one
router.delete('/:id,', (req, res) => {

});

module.exports = router;