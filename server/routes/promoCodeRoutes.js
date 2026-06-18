const express = require('express');
const { createPromoCode, getPromoCodes, validatePromoCode, applyPromoCode, updatePromoCode, deletePromoCode } = require('../controllers/promoCodeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, authorize('admin'), createPromoCode);
router.get('/', getPromoCodes);
router.post('/validate', validatePromoCode);
router.post('/apply', protect, applyPromoCode);
router.patch('/:id', protect, authorize('admin'), updatePromoCode);
router.delete('/:id', protect, authorize('admin'), deletePromoCode);

module.exports = router;
