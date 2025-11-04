const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'finished'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Gamelist', gameSchema);

/**
 * JSON watchlist 
 * @example
 * {
 *   "user": "64f8b3a2e5f9c1a1b2c3d4e5",
 *   "game": "64f8b3a2e5f9c1a1b2c3d4e6",
 *   "status": "to_play"
 * }
 */
