const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: String,
  description: String,
  genre: [String],
  releaseYear: Number,
  platform: String,
  ageRating: String,
  priceCHF: Number,
  tags: [String],
  multiplayer: Boolean,
  earlyAccess: Boolean,
  supportedLanguages: [String],
  averagePlaytimeHours: Number,
  studio: {
    name: String,
    country: String,
    foundedYear: Number,
    website: String,
    sizeCategory: String,
    hqCity: String
  },
  coverImage: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Game', gameSchema);