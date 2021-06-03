const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

// Error Handling
const catchAsync = require('../utils/catchAsync');

// Controllers
const campgrounds = require('../controllers/campgrounds.controller');

// Routes
router
	.route('/')
	.get(catchAsync(campgrounds.getCampgrounds))
	.post(
		isLoggedIn,
		validateCampground,
		catchAsync(campgrounds.createCampground)
	);

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router
	.route('/:id')
	.get(catchAsync(campgrounds.getSingleCampground))
	.put(
		isLoggedIn,
		isAuthor,
		validateCampground,
		catchAsync(campgrounds.editCampground)
	)
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm);

module.exports = router;
