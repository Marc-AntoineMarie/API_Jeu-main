const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { 
        type: String,
        required: true
    },
        nickname: { 
        type: String, 
        required: true, 
        unique: true 
    },
        email: { 
        type: String, 
        required: true, 
        unique: true 
    },
        password: { 
        type: String, 
        required: true 
    },
        role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

/**
 * JSON utilisateur 
 * @example
 * {
 *   "name": "John Doe",
 *   "nickname": "johndoe",
 *   "email": "johndoe@example.com",
 *   "password": "password123",
 *   "role": "user"
 * }
 */