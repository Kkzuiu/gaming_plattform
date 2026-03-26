const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const ctrl = require('../controllers/gameController');

router.get('/', ctrl.getGames);
router.get('/:id', ctrl.getGame);

router.post(
  '/',
  [
    body('title', 'Title is required').notEmpty(),
    body('studio', 'Studio is required').notEmpty()
  ],
  validate,
  ctrl.createGame
);

router.put('/:id', ctrl.updateGame);
router.delete('/:id', ctrl.deleteGame);

module.exports = router;