const express = require('express');
const router = express.Router({mergeParams: true}); 
const reviewControl = require('../controllers/review')
const catchAsync = require('../Utilities/catchAsync')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

//post review route
router.post('/', isLoggedIn, validateReview, catchAsync(reviewControl.postReview))

//delete review route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewControl.deleteReview))

module.exports = router;
