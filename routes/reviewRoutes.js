const express = require('express');

const router = express.Router({ mergeParams: true });

const reviewsController = require('./../controllers/reviewsController');
const authController = require('./../controllers/authController');

router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewsController.createReview
  );

module.exports = router;
