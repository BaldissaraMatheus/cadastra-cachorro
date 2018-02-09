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

module.exports = router;
