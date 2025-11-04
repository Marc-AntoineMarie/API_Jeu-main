const Genre = require('../models/Genre');
const Game = require('../models/Game');
const Review = require('../models/Review');
const Watchlist = require('../models/GameList');


exports.createGame = async (req, res) => {
    try {
        const { title, description, release_year, genre } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const game = await Game.create({ title, description, release_year, genre });

        res.status(201).json({ game, message: 'Game created successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error creating game' });
    }
};

exports.getAllGames = async (req, res) => {
    try {
        const games = await Game.find().populate('genre');
        if (!games) {
            return res.status(404).json({ message: 'games not found' });
        }
        res.status(200).json({ games, message: 'games fetched successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error fetching games' });
    }
};

exports.getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id).populate('genre');
        if (!game) {
            return res.status(404).json({ message: 'game not found' });
        }
        res.status(200).json({ game, message: 'game fetched successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error fetching game' });
    }
};

exports.updateGame = async (req, res) => {
    try {
        const update = { ...req.body };
        const game = await Game.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
        if (!game) {
            return res.status(404).json({ message: 'game not found' });
        }
        res.status(200).json({ game, message: 'game updated successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error updating game' });
    }
};

exports.deleteGame = async (req, res) => {
    try {
        const game = await game.findByIdAndDelete(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'game not found' });
        }
        res.status(200).json({ game, message: 'game deleted successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error deleting game' });
    }
};