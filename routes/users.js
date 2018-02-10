const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User register
router.get('/register', (req, res) => {
  res.render('users/register', {
    title: 'Cadastrar usuário'
  });
});

// User login
router.get('/login', (req, res) => {
  res.render('users/login', {
    title: 'Fazer login'
  });
});

//Login form post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/cachorros',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Load User Model
require('../models/User');
const User = mongoose.model('users');

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
    User.findOne({email: req.body.email})
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email já cadastrado');
          res.redirect('/users/register');
        } else {        
          const newUser = new User({
            name: req.body.name,
            email:req.body.email,
            password: req.body.password
          });
      
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'Você está registrado e pode logar no site');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});

// Logout user
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Você foi desconectado');
  res.redirect('/users/login');
});

module.exports = router;
