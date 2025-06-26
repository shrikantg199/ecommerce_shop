const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  getAdminStats,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../utils/multer');

// GET /api/products - Get all products
router.route('/').get(getProducts).post(protect, admin, createProduct);

// GET /api/products/:id - Get product by ID
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

router.post('/upload', protect, admin, upload.single('image'), uploadProductImage);

router.get('/admin-stats', protect, admin, getAdminStats);

module.exports = router; 