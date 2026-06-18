const express = require('express');
const { createOrder, getOrders, getOrderById, updateOrderStatus, getOrderReceipt } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.get('/:id/receipt', protect, getOrderReceipt);

module.exports = router;
