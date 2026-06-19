const express = require('express');
const { getDashboardStats, exportOrdersExcel } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard-stats', protect, authorize('admin'), getDashboardStats);
router.get('/export-orders', protect, authorize('admin'), exportOrdersExcel);

module.exports = router;
