const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  displayName: String,
  email: { type: String, required: true, unique: true },
  country: String,
  birthYear: Number,
  joinedAt: { type: Date, default: Date.now },
  level: { type: Number, default: 1 },
  status: { type: String, default: 'active' },
  preferredLanguage: String,
  discordTag: String,
  bio: String,
  avatarUrl: String,
  password: { type: String, required: true },
  library: [{
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    addedAt: { type: Date, default: Date.now },
    hoursPlayed: { type: Number, default: 0 },
    lastPlayedAt: Date,
    achievements: [String],
    rank: String
  }]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('User', userSchema);