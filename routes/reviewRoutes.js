const express = require('express');

const router = express.Router();
const reviewsController = require('./../controllers/reviewsController');
const authController = require('./../controllers/authController');

router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(authController.protect, reviewsController.createReview);

module.exports = router;
