const mongoose = require('mongoose');
mongoose.promise = global.Promise; // Tells mongoose to use ES6 promises
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.index = (req, res) => {
  // res.render('index', { title: 'Artist Tracker' });
  res.redirect('/profile');
};

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login/Signup' });
};

exports.profile = (req, res) => {
  res.render('profile', { title: 'Profile' });
};

exports.account = (req, res) => {
  res.render('profile', { title: 'Profile' });
};

// Middleware that validates the signup form
exports.validateSignUp = (req, res, next) => {
  req.sanitizeBody('username');
  req.checkBody('username', 'You must supply a username').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password is required').notEmpty();
  req
    .checkBody('password-confirm', 'Confirmed Password can not be blank')
    .notEmpty();
  req
    .checkBody('password-confirm', 'Your passwords do not match')
    .equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.status(422).render('login', {
      title: 'Signup',
      body: req.body,
      flashes: req.flash()
    });
    return;
  }
  next();
};

// Signup The user
exports.signup = async (req, res, next) => {
  const user = new User({ username: req.body.username, email: req.body.email });
  const registerASync = promisify(User.register, User);

  try {
    await registerASync(user, req.body.password);
  } catch (err) {
    return next(err);
  }
  next();
};

// Updates the name, email and password for an user
exports.updateAccount = async (req, res) => {
  const updates = {
    email: req.body.email
  };

  try {
    const user = new User(req.user);
    const changePassword = promisify(user.changePassword, user);
    await changePassword(req.body['current-password'], req.body.password);

    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: updates },
      { new: true, runValidators: true, context: 'query' }
    );
    // Redirects to the previous page
    req.flash('success', 'Profile Updated!');
    res.redirect('back');
  } catch (error) {
    req.flash('error', 'Incorrect Current Password');
    res.redirect('back');
  }
};
