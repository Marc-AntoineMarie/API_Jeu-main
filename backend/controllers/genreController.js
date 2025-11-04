const Genre = require('../models/Genre');

exports.createGenre = async (req, res) => {
    try {
        const { name } = req.body; 

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const genre = await Genre.create({ name });

        res.status(201).json({ genre, message: 'Genre created successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error creating genre' });
    }
};

exports.getAllGenres = async (req, res) => {
    try {
        const genres = await Genre.find();
        if (!genres) {
            return res.status(404).json({ message: 'Genres not found' });
        }
        res.status(200).json({ genres, message: 'Genres fetched successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error fetching genres' });
    }
};

exports.getGenreById = async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if (!genre) {
            return res.status(404).json({ message: 'Genre not found' });
        }
        res.status(200).json({ genre, message: 'Genre fetched successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error fetching genre' });
    }
};

exports.updateGenre = async (req, res) => {
    try {
        const update = { ...req.body };
        const genre = await Genre.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
        if (!genre) {
            return res.status(404).json({ message: 'Genre not found' });
        }
        res.status(200).json({ genre, message: 'Genre updated successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error updating genre' });
    }
};

exports.deleteGenre = async (req, res) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);
        if (!genre) {
            return res.status(404).json({ message: 'Genre not found' });
        }
        res.status(200).json({ genre, message: 'Genre deleted successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error deleting genre' });
    }
};
