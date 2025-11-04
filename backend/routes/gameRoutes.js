const express = require('express');
const router = express.Router();

const gameController = require('../controllers/gameController');
const verifyToken = require('../middlewares/verifyToken');
const { authorizeRole } = require('../middlewares/authorizeRole');

router.post('/new', verifyToken, authorizeRole('admin'), gameController.createGame);
router.get('/all', verifyToken, gameController.getAllGames);
router.get('/:id', verifyToken, gameController.getGameById);
router.put('/:id', verifyToken, authorizeRole('admin'), gameController.updateGame);
router.delete('/:id', verifyToken, authorizeRole('admin'), gameController.deleteGame);

module.exports = router;