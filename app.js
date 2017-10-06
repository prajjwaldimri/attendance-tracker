const path = require('path');
const compression = require('compression');
const express = require('express');
var app = express();
const hbs = require('hbs');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

const helpers = require('./helpers');
const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandlers');
require('./handlers/passport');

// G-zip compression
app.use(compression());

// Gets info from HTML forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(expressValidator());

// Set the templating engine to http://handlebarsjs.com/
hbs.registerPartials(path.join(__dirname, '/views/partials'));
app.set('view engine', 'hbs');

// Passport settings
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(cookieParser());
app.use(passport.session());

// Serve static JS and css files
app.use(express.static(path.join(__dirname, 'dist')));

// Pass variables to all our templates
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentYear = new Date().getFullYear();
  next();
});

// Delegate all routing responsibility to routes module.
app.use('/', routes);

// If above routes do not work, we send the user to 404
app.use(errorHandlers.notFound);

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandlers.developmentErrors);
}

// Handling production errors
app.use(errorHandlers.productionErrors);

module.exports = app;
