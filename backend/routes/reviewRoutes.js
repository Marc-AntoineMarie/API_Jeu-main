const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/new', verifyToken, reviewController.createReview);
router.get('/all', verifyToken, reviewController.getAllReviews);
router.get('/:id', verifyToken, reviewController.getReviewById);
router.put('/:id', verifyToken, reviewController.updateReview);
router.delete('/:id', verifyToken, reviewController.deleteReview);

module.exports = router;