const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const searchController = require('../controllers/searchController');
const artistController = require('../controllers/artistController');
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
// POST artistName to this route to add it to a user's favorites
router.post(
  '/account/addArtist',
  authController.isLoggedIn,
  catchErrors(artistController.addNewArtist)
);

router.get('/search/:artistName', catchErrors(searchController.search));

module.exports = router;
