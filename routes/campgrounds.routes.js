const express = require('express');
const multer = require('multer');
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

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
		upload.array('image'),
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
		upload.array('image'),
		validateCampground,
		catchAsync(campgrounds.editCampground)
	)
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm);

module.exports = router;
