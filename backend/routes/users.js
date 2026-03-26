const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/userController');

router.get('/me', auth, ctrl.getProfile);
router.get('/me/library', auth, ctrl.getLibrary);
router.post('/me/library/:gameId', auth, ctrl.addToLibrary);
router.delete('/me/library/:gameId', auth, ctrl.removeFromLibrary);

module.exports = router;