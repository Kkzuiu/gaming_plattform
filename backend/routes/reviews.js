const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const auth = require('../middleware/auth');
const ctrl = require('../controllers/reviewController');

router.get('/game/:gameId', ctrl.getReviewsByGame);

router.post(
  '/',
  [
    auth,
    body('gameId', 'Game ID is required').notEmpty(),
    body('rating', 'Rating is required and must be a number').isNumeric(),
    body('text', 'Text is required').notEmpty()
  ],
  validate,
  ctrl.createReview
);

router.put('/:id', auth, ctrl.updateReview);
router.delete('/:id', auth, ctrl.deleteReview);

module.exports = router;