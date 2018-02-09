const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();
mongoose.connect('mongodb://localhost/fumaca_db', {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Load routes
const cachorros = require('./routes/cachorros');
const users = require('./routes/users');

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
const title = 'Cachorro fumaça';

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

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
});

app.get('/', (req, res) => {
  res.render('index', {
    title: title});
});

app.get('/about', (req, res) => {
  res.render('about');
});

// Use routes
app.use('/cachorros', cachorros);
app.use('/users', users);

// Load server
const port = 5001;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});