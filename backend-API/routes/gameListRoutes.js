const express = require('express');
const router = express.Router();

const gamelistController = require('../controllers/gamelistController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/new', verifyToken, gamelistController.createGamelist);
router.get('/all', verifyToken, gamelistController.getAllGamelist);
router.get('/:id', verifyToken, gamelistController.getGamelistById);
router.put('/:id', verifyToken, gamelistController.updateGamelist);
router.delete('/:id', verifyToken, gamelistController.deleteGamelist);

module.exports = router;