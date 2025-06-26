const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// POST /api/orders - Create order (user only)
router.post('/', protect, addOrderItems);

// GET /api/orders - Get orders (admin: all, user: own)
router.get('/', protect, admin, getOrders);

// GET /api/orders/myorders - Get user's orders
router.get('/myorders', protect, getMyOrders);

// GET /api/orders/:id - Get order by ID
router.get('/:id', protect, getOrderById);

// PUT /api/orders/:id/pay - Update order to paid
router.put('/:id/pay', protect, updateOrderToPaid);

// PUT /api/orders/:id/deliver - Update order to delivered (admin only)
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

module.exports = router; 