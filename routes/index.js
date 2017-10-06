const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', userController.index);

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/signup', userController.loginForm);
router.post(
  '/signup',
  userController.validateSignUp,
  userController.signup,
  authController.login
);

// Account related routes
router.get('/profile', authController.isLoggedIn, userController.profile);

router.get('/account', authController.isLoggedIn, userController.account);
router.post(
  '/account',
  authController.confirmedPasswords,
  catchErrors(userController.updateAccount)
);
router.get('/account/forgot', authController.forgotForm);
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post(
  '/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

module.exports = router;
