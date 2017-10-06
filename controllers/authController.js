const passport = require('passport');
const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const User = mongoose.model('User');
const crypto = require('crypto');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true,
  successRedirect: '/profile',
  successFlash: 'Welcome!'
});

// Logs out the user
exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'Successfully logged out.');
  res.redirect('/login');
};

// Middleware that checks if any user is currently logged in
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('You need to be logged in to do this');
  res.status(401).redirect('/login');
};

exports.forgotForm = (req, res) => {
  res.render('forgot', { title: 'Forgot Password' });
};

// Method to initiate the forgot password request
exports.forgot = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'No account associated with that email exists.');
    return res.redirect('/login');
  }
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  await user.save();

  // Send the user an email containing reset token
  const resetURL = `http://${req.headers
    .host}/account/reset/${user.resetPasswordToken}`;

  mail.send({ user, subject: 'Password Reset', resetURL });
  req.flash(
    'success',
    'An email has been sent to your account with the reset link. It will be valid for 1 hour'
  );
  res.redirect('/login');
};

// Resets the account information for user with which the `resetPasswordToken` is associated
exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash('Token expired or invalid');
    return res.redirect('/login');
  }
  res.render('reset', { title: 'Reset your password' });
};

// Checks if the {password} and {password-confirm} fields are same
exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    next();
    return;
  }
  req.flash('error', 'Passwords do not match');
  res.redirect('back');
};

// Updates details of a user in database
exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash('Token expired or invalid');
    return res.redirect('/login');
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  req.login(updatedUser, err => {
    if (err) {
      return res.redirect('/login');
    }
    req.flash('success', 'Password has been reset');
    res.redirect('/profile');
  });
};
