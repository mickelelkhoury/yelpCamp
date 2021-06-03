// Models
const User = require('../models/user.model');

module.exports.renderRegisterForm = (req, res) => {
	res.render('users/register');
};

module.exports.register = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash('success', 'Welcome to YelpCamp!');
			res.redirect('/campgrounds');
		});
	} catch (error) {
		req.flash('error', error.message);
		res.redirect('register');
	}
};

module.exports.renderLoginForm = (req, res) => {
	res.render('users/login');
};

module.exports.login = (req, res) => {
	req.flash('success', 'Welcome Back!');
	const redirectUrl = req.session.returnTo || '/campgrounds';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'Goodbye!');
	res.redirect('/campgrounds');
};
