const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  rating: { 
    type: Number,
    min: 0,
    max: 5,
    required: true
  },
  comment: { 
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);

/**
 * JSON review 
 * @example
 * {
 *   "user": "64f8b3a2e5f9c1a1b2c3d4e5",
 *   "game": "64f8b3a2e5f9c1a1b2c3d4e6",
 *   "rating": 5,
 *   "comment": "Un chef-d'œuvre !"
 * }
 */
