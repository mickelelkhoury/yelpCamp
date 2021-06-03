const express = require('express');
const passport = require('passport');
const router = express.Router();

// Error Handling
const catchAsync = require('../utils/catchAsync');

// Controllers
const users = require('../controllers/users.controller');

// Routes
router.get('/register', users.renderRegisterForm);

router.post('/register', catchAsync(users.register));

router.get('/login', users.renderLoginForm);

router.post(
	'/login',
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login',
	}),
	users.login
);

router.get('/logout', users.logout);

module.exports = router;
