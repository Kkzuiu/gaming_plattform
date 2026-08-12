const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  displayName: String,
  avatarUrl: String,
  text: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model('Review', reviewSchema);