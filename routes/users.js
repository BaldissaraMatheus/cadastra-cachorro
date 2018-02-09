const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// User register
router.get('/register', (req, res) => {
  res.render('users/register');
});

// User login
router.get('/login', (req, res) => {
  res.render('users/login');
});

// Register Form POST
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) 
    errors.push({text: 'Campo senha e confirmar senha estão diferentes'});
  
  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    res.send('passed');
  }
});

module.exports = router;
