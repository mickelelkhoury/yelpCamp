const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn } = require('../middleware');

// Error Handling
const catchAsync = require('../utils/catchAsync');

// Controllers
const reviews = require('../controllers/reviews.controller');

// Routes
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, catchAsync(reviews.deleteReview));

module.exports = router;
