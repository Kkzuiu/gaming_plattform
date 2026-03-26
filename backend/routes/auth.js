const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { register, login } = require('../controllers/authController');

router.post(
  '/register',
  [
    body('username', 'Username is required').notEmpty().trim(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('birthYear')
      .optional()
      .isInt({ min: 1900, max: 2010 })
      .withMessage('Birth year must be between 1900 and 2010'),
    body('country').optional().isString().trim(),
    body('preferredLanguage').optional().isString().trim(),
    body('discordTag').optional().isString().trim(),
    body('bio').optional().isString().trim()
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
  ],
  validate,
  login
);

module.exports = router;