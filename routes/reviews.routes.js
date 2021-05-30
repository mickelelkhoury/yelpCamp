const express = require('express');
const router = express.Router({ mergeParams: true });

// Error Handling
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// Models
const Campground = require('../models/campground');
const Review = require('../models/review');

// Validation Schemas
const { reviewSchema } = require('../schemas.js');

// Middleware
const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const message = error.details.map((el) => el.message).join(',');
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};

// Routes
router.post(
	'/',
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
		campground.reviews.push(review);
		await review.save();
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	'/:reviewId',
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, {
			$pull: { reviews: reviewId },
		});
		await Review.findByIdAndDelete(reviewId);
		res.redirect(`/campgrounds/${id}`);
	})
);

module.exports = router;
