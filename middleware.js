// Error Handling
const ExpressError = require('./utils/ExpressError');

// Validation Schemas
const { campgroundSchema } = require('./schemas.js');
const { reviewSchema } = require('./schemas.js');

// Models
const Campground = require('./models/campground.model');
const Review = require('./models/review.model');

// check if logged in
module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must be signed in!');
		return res.redirect('/login');
	}
	next();
};

// check if the campground is valid
module.exports.validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const message = error.details.map((el) => el.message).join(',');
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};

// check authorization for author
module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that');
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

// check if the review is valid
module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const message = error.details.map((el) => el.message).join(',');
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};

// check author for review
module.exports.isReviewAuthor = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(id);
	if (!review.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that');
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};
