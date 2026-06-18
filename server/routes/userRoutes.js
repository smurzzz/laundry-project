const express = require('express');
const { getUserProfile, updateUserProfile, getAllCustomers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, authorize('admin'), getAllCustomers);

module.exports = router;
