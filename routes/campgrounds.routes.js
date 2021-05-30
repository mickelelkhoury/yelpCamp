const express = require('express');
const router = express.Router();

// Error Handling
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// Models
const Campground = require('../models/campground');

// Validation Schemas
const { campgroundSchema } = require('../schemas.js');

// Middleware
const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const message = error.details.map((el) => el.message).join(',');
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};

// Routes
router.get('/', async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
});

router.get('/new', (req, res) => {
	res.render('campgrounds/new');
});

router.post(
	'/',
	validateCampground,
	catchAsync(async (req, res, next) => {
		// if (!req.body.campground)
		// 	throw new ExpressError('Invalid Campground Data', 400);
		const campground = new Campground(req.body.campground);
		await campground.save();
		req.flash('success', 'Campground created successfully!');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate(
			'reviews'
		);
		res.render('campgrounds/show', { campground });
	})
);

router.get(
	'/:id/edit',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		res.render('campgrounds/edit', { campground });
	})
);

router.put(
	'/:id',
	validateCampground,
	catchAsync(async (req, res, next) => {
		const { id } = req.params;

		if (!id) throw new ExpressError('Invalid Campground ID', 400);

		const campground = await Campground.findByIdAndUpdate(id, {
			...req.body.campground,
		});
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	'/:id',
	catchAsync(async (req, res, next) => {
		const { id } = req.params;

		if (!id) throw new ExpressError('Invalid Campground ID', 400);

		await Campground.findByIdAndDelete(id);
		res.redirect('/campgrounds');
	})
);

module.exports = router;
