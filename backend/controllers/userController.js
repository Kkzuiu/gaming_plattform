const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json({ success: true, data: user });
};

exports.getLibrary = async (req, res) => {
  const user = await User.findById(req.user.id).populate('library.gameId');
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, count: user.library.length, data: user.library });
};

exports.addToLibrary = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new AppError('User not found', 404);

  const alreadyExists = user.library.some(
    entry => entry.gameId && entry.gameId.toString() === req.params.gameId
  );

  if (alreadyExists) {
    return res.status(400).json({ success: false, error: 'Game already in library' });
  }

  user.library.push({ gameId: req.params.gameId });
  await user.save();

  // Re-fetch without password to return clean data
  const updated = await User.findById(req.user.id).select('-password');
  res.json({ success: true, data: updated.library });
};

exports.removeFromLibrary = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new AppError('User not found', 404);

  user.library = user.library.filter(
    entry => entry.gameId && entry.gameId.toString() !== req.params.gameId
  );
  await user.save();

  const updated = await User.findById(req.user.id).select('-password');
  res.json({ success: true, data: updated.library });
};