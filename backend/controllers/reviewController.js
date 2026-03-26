const Review = require('../models/Review');
const AppError = require('../utils/AppError');

exports.getReviewsByGame = async (req, res) => {
  const reviews = await Review.find({ gameId: req.params.gameId });
  res.json({ success: true, count: reviews.length, data: reviews });
};

exports.createReview = async (req, res) => {
  const review = await Review.create({
    ...req.body,
    userId: req.user.id
  });
  res.status(201).json({ success: true, data: review });
};

exports.updateReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  if (review.userId.toString() !== req.user.id) {
    throw new AppError('Not authorized to update this review', 403);
  }

  Object.assign(review, req.body);
  await review.save();

  res.json({ success: true, data: review });
};

exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  if (review.userId.toString() !== req.user.id) {
    throw new AppError('Not authorized to delete this review', 403);
  }

  await review.deleteOne();
  res.json({ success: true, data: {} });
};