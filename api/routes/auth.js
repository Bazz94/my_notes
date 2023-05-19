const express = require('express');
const router = express.Router();

// Login user
router.get('/', (req, res) => {
  // get email and password from body
  // check that password is correct
  // return user id
});

// Create user
router.post('/', (req, res) => {
  // get email and password from body
  // check that email is unique 
  // create user
  // return user id
});


module.exports = router;