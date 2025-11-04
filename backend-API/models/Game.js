const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true
  },
  description: { 
    type: String
  },
  release_year: { 
    type: Number
  },
  genre: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);

/**
 * JSON film 
 * @example
 * {
 *   "title": "Inception",
 *   "description": "Un film de science-fiction sur les rêves...",
 *   "release_year": 2010,
 *   "genre": "64f8b3a2e5f9c1a1b2c3d4e5"
 * }
 */
