const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        if (!users) {
            return res.status(404).json({ message: 'Users not found' });
        }
        res.status(200).json({ users, message: 'Users fetched successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error fetching users' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const users = await User.findById(req.params.id).select('-password');
        if (!users) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ users, message: 'Users fetched successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error fetching users' });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_expiresIn });
        res.status(200).json({ user, token, message: 'User logged in successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error logging in user' });
    }
}

exports.logoutUser = async (req, res) => {
    try {
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error logging out user' });
    }
}

exports.createUser = async (req, res) => {
    try{
        const { name, nickname, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = (await User.create({ name, nickname, email, password: hashedPassword }));

        res.status(201).json({ user, message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error creating user' });
    }
}

exports.updateUser = async (req, res) => {
    try{
        const update = { ...req.body };
        if (update.password) {
            update.password = await bcrypt.hash(update.password, 10);
        }

        const users = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).select('-password');
        if (!users) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ users, message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error updating user' });
    }
}

exports.deleteUser = async (req, res) => {
    try{
        const users = await User.findByIdAndDelete(req.params.id);
        if (!users) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ users, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ Error: error.message, message: 'Error deleting user' });
    }
}