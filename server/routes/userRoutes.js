const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, getUserProfile, updateUserProfile, getCart, updateCart } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('../utils/multer');

router.get('/', protect, admin, getUsers);

// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login
router.post('/login', loginUser);

// GET /api/users/profile
router.get('/profile', protect, getUserProfile);

// PUT /api/users/profile
router.put('/profile', protect, multer.single('profileImage'), updateUserProfile);

// GET /api/users/cart
router.get('/cart', protect, getCart);

// POST /api/users/cart
router.post('/cart', protect, updateCart);

module.exports = router; 