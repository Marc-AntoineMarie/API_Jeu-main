const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');
const { authorizeRole } = require('../middlewares/authorizeRole');

//Route public
router.post('/login', userController.loginUser);
router.post('/register', userController.createUser);

// Route privé (JWT obligatoire)
router.get('/', verifyToken, authorizeRole('admin'), userController.getAllUsers);
router.get('/:id', verifyToken, authorizeRole('admin'), userController.getUserById);
router.put('/:id', verifyToken, authorizeRole('admin'), userController.updateUser);
router.delete('/:id', verifyToken, authorizeRole('admin'), userController.deleteUser);
router.post('/logout', userController.logoutUser);


module.exports = router;