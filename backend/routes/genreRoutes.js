const express = require('express');
const router = express.Router();

const genreController = require('../controllers/genreController');
const verifyToken = require('../middlewares/verifyToken');
const { authorizeRole } = require('../middlewares/authorizeRole');

router.post('/new', verifyToken, authorizeRole('admin'), genreController.createGenre);
router.get('/all', verifyToken, genreController.getAllGenres);
router.get('/:id', verifyToken, genreController.getGenreById);
router.put('/:id', verifyToken, authorizeRole('admin'), genreController.updateGenre);
router.delete('/:id', verifyToken, authorizeRole('admin'), genreController.deleteGenre);

module.exports = router;