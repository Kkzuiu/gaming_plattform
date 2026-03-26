const Game = require('../models/Game');
const AppError = require('../utils/AppError');

exports.getGames = async (req, res) => {
  const games = await Game.find();
  res.json({ success: true, count: games.length, data: games });
};

exports.getGame = async (req, res) => {
  const game = await Game.findById(req.params.id);
  
  if (!game) {
    throw new AppError(`Game not found with id of ${req.params.id}`, 404);
  }
  
  res.json({ success: true, data: game });
};

exports.createGame = async (req, res) => {
  const game = await Game.create(req.body);
  res.status(201).json({ success: true, data: game });
};

exports.updateGame = async (req, res) => {
  const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!game) {
    throw new AppError(`Game not found with id of ${req.params.id}`, 404);
  }

  res.json({ success: true, data: game });
};

exports.deleteGame = async (req, res) => {
  const game = await Game.findByIdAndDelete(req.params.id);

  if (!game) {
    throw new AppError(`Game not found with id of ${req.params.id}`, 404);
  }

  res.json({ success: true, data: {} });
};