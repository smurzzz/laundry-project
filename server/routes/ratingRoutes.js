const express = require('express');
const { createRating, getRatings, getMyRatings, updateRating, deleteRating } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createRating);
router.get('/', getRatings);
router.get('/my-ratings', protect, getMyRatings);
router.patch('/:id', protect, updateRating);
router.delete('/:id', protect, deleteRating);

module.exports = router;
