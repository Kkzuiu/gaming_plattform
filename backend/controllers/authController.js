const AppError = require('../utils/AppError');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { 
    username, email, password, 
    country, birthYear, preferredLanguage, discordTag, bio 
  } = req.body;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new AppError('An account with this email already exists', 400);
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new AppError('This username is already taken', 400);
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({ 
    username, 
    displayName: username,
    email, 
    password: hashed,
    country,
    birthYear,
    preferredLanguage,
    discordTag,
    bio
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  // Return user without password
  const userObj = user.toObject();
  delete userObj.password;

  res.status(201).json({
    success: true,
    data: {
      token,
      user: userObj
    }
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  const userObj = user.toObject();
  delete userObj.password;

  res.json({
    success: true,
    data: {
      token,
      user: userObj
    }
  });
};