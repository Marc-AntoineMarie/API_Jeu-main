const Gamelist = require('../models/GameList');

exports.createGamelist = async (req, res) => {
    try {
        const { game, status  } = req.body;
        const user = req.user.id;
        if (!game) {
            return res.status(400).json({ message: 'Game name is required' });
        }

        const gamelist = await Gamelist.create({ game, status , user });

        res.status(201).json({ gamelist, message: 'Gamelist created successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error creating gamelist' });
    }
};

exports.getAllGamelist = async (req, res) => {
    try {
        const gamelist = await Gamelist.find().populate('game');
        if (!gamelist) {
            return res.status(404).json({ message: 'gamelist not found' });
        }
        res.status(200).json({ gamelist, message: 'gamelist fetched successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error fetching gamelist' });
    }
};

exports.getGamelistById = async (req, res) => {
    try {
        const gamelist = await Gamelist.findById(req.params.id).populate('game');
        if (!gamelist) {
            return res.status(404).json({ message: 'gamelist not found' });
        }
        res.status(200).json({ gamelist, message: 'gamelist fetched successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error fetching gamelist' });
    }
};

exports.deleteGamelist = async (req, res) => {
    try {
        const gamelist = await Gamelist.findByIdAndDelete(req.params.id);
        if (!gamelist) {
            return res.status(404).json({ message: 'gamelist not found' });
        }
        res.status(200).json({ gamelist, message: 'gamelist deleted successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error deleting gamelist' });
    }
};

exports.updateGamelist = async (req, res) => {
    try {
        const update = { ...req.body };
        const gamelist = await Gamelist.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
        if (!gamelist) {
            return res.status(404).json({ message: 'gamelist not found' });
        }
        res.status(200).json({ gamelist, message: 'gamelist updated successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error updating gamelist' });
    }
};