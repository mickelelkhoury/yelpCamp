const express = require('express');
const passport = require('passport');
const router = express.Router();

// Error Handling
const catchAsync = require('../utils/catchAsync');

// Controllers
const users = require('../controllers/users.controller');

// Routes
router
	.route('/register')
	.get(users.renderRegisterForm)
	.post(catchAsync(users.register));

router
	.route('/login')
	.get(users.renderLoginForm)
	.post(
		passport.authenticate('local', {
			failureFlash: true,
			failureRedirect: '/login',
		}),
		users.login
	);

router.get('/logout', users.logout);

module.exports = router;
