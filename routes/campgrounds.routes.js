const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

// Error Handling
const catchAsync = require('../utils/catchAsync');

// Controllers
const campgrounds = require('../controllers/campgrounds.controller');

// Routes
router.get('/', catchAsync(campgrounds.getCampgrounds));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post(
	'/',
	isLoggedIn,
	validateCampground,
	catchAsync(campgrounds.createCampground)
);

router.get('/:id', catchAsync(campgrounds.getSingleCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm);

router.put(
	'/:id',
	isLoggedIn,
	isAuthor,
	validateCampground,
	catchAsync(campgrounds.editCampground)
);

router.delete(
	'/:id',
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
