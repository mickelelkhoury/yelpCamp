const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
	res.render('users/register');
});

router.post(
	'/register',
	catchAsync(async (req, res, next) => {
		try {
			const { email, username, password } = req.body;
			const user = new User({ email, username });
			const registeredUser = await User.register(user, password);
			req.login(registeredUser, (errr) => {
				if (err) return next(err);
				req.flash('success', 'Welcome to YelpCamp!');
				res.redirect('/campgrounds');
			});
		} catch (error) {
			req.flash('error', error.message);
			res.redirect('register');
		}
	})
);

router.get('/login', (req, res) => {
	res.render('users/login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login',
	}),
	(req, res) => {
		req.flash('success', 'Welcome Back!');
		const redirectUrl = req.session.returnTo || '/campgrounds';
		delete req.session.returnTo;
		res.redirect(redirectUrl);
	}
);

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Goodbye!');
	res.redirect('/campgrounds');
});

module.exports = router;
