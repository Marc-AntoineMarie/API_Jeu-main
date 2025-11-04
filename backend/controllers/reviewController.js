const Genre = require('../models/Genre');
const Game = require('../models/Game');
const Review = require('../models/Review');
const Watchlist = require('../models/GameList');

const verifyToken = require('../middlewares/verifyToken');

exports.createReview = async (req, res) => {
    try {
        const { game, rating, comment  } = req.body;
        const user = req.user.id;
        if (!game) {
            return res.status(400).json({ message: 'Game name is required' });
        }   
        

        const review = await Review.create({ game, rating, comment, user });

        res.status(201).json({  review, message: 'Review created successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error creating review' });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const review = await Review.find().populate('game').populate('user');
        if (!review) {
            return res.status(404).json({ message: 'Reviews not found' });
        }
        res.status(200).json({ review, message: 'Reviews fetched successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error fetching reviews' });
    }
};

exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('game').populate('user');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ review, message: 'Review fetched successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error fetching review' });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const update = { ...req.body };
        const review = await Review.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ review, message: 'Review updated successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error updating review' });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ review, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error deleting review' });
    }
};