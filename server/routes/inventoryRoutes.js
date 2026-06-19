const express = require('express');
const { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem, getLowStockItems } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getInventory);
router.post('/', protect, authorize('admin'), createInventoryItem);
router.put('/:id', protect, authorize('admin'), updateInventoryItem);
router.delete('/:id', protect, authorize('admin'), deleteInventoryItem);
router.get('/low-stock', protect, authorize('admin'), getLowStockItems);

module.exports = router;
