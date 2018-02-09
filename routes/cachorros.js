const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load Cachorro Model
require('../models/Cachorro');
const Cachorro = mongoose.model('cachorros');

// Index page
router.get('/', ensureAuthenticated, (req, res) => {
  Cachorro.find({})
    .sort({date:'desc'})
    .then(cachorros => {
      res.render('cachorros/index', {
        cachorros:cachorros
      });
  });
});

// Add cachorro
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('cachorros/add');
});

// Carrega página de editar cachorro
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Cachorro.findOne({
    _id: req.params.id
  })
  .then(cachorro => {
    res.render('cachorros/edit', {
      cachorro:cachorro
    });
  });
});

router.post('/', ensureAuthenticated, (req, res) => {
  console.log(req.body);
  let errors = [];

  if (!req.body.title) {
    errors.push({text: 'Coloque um título por favor'});
  }

  if (!req.body.desc) {
    errors.push({text: 'Coloque uma descrição por favor'});
  }

  if (errors.length > 0) {
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      desc: req.body.desc
    });
  } else {
    const newUser = {
      title: req.body.title,
      desc: req.body.desc
    };
    new Cachorro(newUser)
      .save()
      .then(cachorro => {
        res.redirect('/cachorros');
      });
  }
});

// Edit cachorro
router.put('/:id', ensureAuthenticated, (req, res) => {
  Cachorro.findOne({
    _id: req.params.id
  })
  .then(cachorro => {
    cachorro.title = req.body.title;
    cachorro.desc = req.body.desc;
    cachorro.save()
      .then(cachorro => {
        req.flash('success_msg', 'Cachorro atualizado');
        res.redirect('/cachorros');
    });
  });
});

// Deleta cachorro
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Cachorro.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Cachorro removido');
      res.redirect('/cachorros');
    });
});

module.exports = router;