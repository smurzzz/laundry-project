const asyncHandler = require('express-async-handler');
const Rating = require('../models/ratingModel');
const LaundryOrder = require('../models/laundryOrderModel');
const ActivityLog = require('../models/activityLogModel');

const createRating = asyncHandler(async (req, res) => {
  const { orderId, serviceId, score, comment } = req.body;
  const userId = req.user.id;

  if (!orderId || !serviceId || !score || score < 1 || score > 5) {
    res.status(400);
    throw new Error('Valid order, service, and score (1-5) required');
  }

  const order = await LaundryOrder.findById(orderId);
  if (!order || order.customer.toString() !== userId) {
    res.status(404);
    throw new Error('Order not found or unauthorized');
  }

  const rating = await Rating.create({ order: orderId, user: userId, service: serviceId, score, comment });

  await ActivityLog.create({ user: userId, action: 'Service rated', details: `Rated service with score ${score}` });

  res.status(201).json(rating);
});

const getRatings = asyncHandler(async (req, res) => {
  const { serviceId, limit = 10 } = req.query;
  const filter = serviceId ? { service: serviceId } : {};
  const ratings = await Rating.find(filter).populate('user', 'name profilePhoto').limit(parseInt(limit)).sort({ createdAt: -1 });
  res.json(ratings);
});

const getMyRatings = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const ratings = await Rating.find({ user: userId }).populate('order service').sort({ createdAt: -1 });
  res.json(ratings);
});

const updateRating = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { score, comment } = req.body;

  const rating = await Rating.findById(id);
  if (!rating || rating.user.toString() !== userId) {
    res.status(404);
    throw new Error('Rating not found or unauthorized');
  }

  if (score) rating.score = score;
  if (comment !== undefined) rating.comment = comment;
  await rating.save();

  res.json(rating);
});

const deleteRating = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const rating = await Rating.findById(id);
  if (!rating || rating.user.toString() !== userId) {
    res.status(404);
    throw new Error('Rating not found or unauthorized');
  }

  await Rating.findByIdAndDelete(id);
  res.json({ message: 'Rating deleted' });
});

module.exports = { createRating, getRatings, getMyRatings, updateRating, deleteRating };
