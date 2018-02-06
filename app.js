const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb://localhost/fumaca_db', {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

require('./models/Cachorro');
const Cachorro = mongoose.model('cachorros');

const title = 'Cachorro fumaça';

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

app.get('/', (req, res) => {
  res.render('index', {
    title: title});
});

// Adiciona cachorro
app.get('/cachorros/add', (req, res) => {
  res.render('cachorros/add');
});

// Carrega página de editar cachorro
app.get('/cachorros/edit/:id', (req, res) => {
  Cachorro.findOne({
    _id: req.params.id
  })
  .then(cachorro => {
    res.render('cachorros/edit', {
      cachorro:cachorro
    });
  });
});

// Carrega Formulário
app.get('/cachorros', (req, res) => {
  Cachorro.find({})
    .sort({date:'desc'})
    .then(cachorros => {
      res.render('cachorros/index', {
        cachorros:cachorros
      });
    });
});

app.post('/cachorros', (req, res) => {
  console.log(req.body);
  let errors = [];

  if (!req.body.title) {
    errors.push({text: 'Coloque um título por favor'});
  }

  if (!req.body.desc) {
    errors.push({text: 'Coloque uma descrição por favor'});
  }


  if (errors.length > 0) {
    res.render('cachorros/add', {
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

app.get('/about', (req, res) => {
  res.render('about');
});

// Edita Cachorro
app.put('/cachorros/:id', (req, res) => {
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
app.delete('/cachorros/:id', (req, res) => {
  Cachorro.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Cachorro removido');
      res.redirect('/cachorros');
    });
});

// Carrega servidor
const port = 5001;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});