const asyncHandler = require('express-async-handler');
const Inventory = require('../models/inventoryModel');
const ActivityLog = require('../models/activityLogModel');

const getInventory = asyncHandler(async (req, res) => {
  const items = await Inventory.find({}).sort({ itemName: 1 });
  res.json(items);
});

const createInventoryItem = asyncHandler(async (req, res) => {
  const { itemName, category, quantity, threshold, unit } = req.body;
  const existing = await Inventory.findOne({ itemName });
  if (existing) {
    res.status(400);
    throw new Error('Inventory item already exists');
  }

  const item = await Inventory.create({ itemName, category, quantity, threshold, unit });
  await ActivityLog.create({ user: req.user._id, action: 'Inventory item created', details: itemName });
  res.status(201).json(item);
});

const updateInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  item.category = req.body.category || item.category;
  item.quantity = req.body.quantity ?? item.quantity;
  item.threshold = req.body.threshold ?? item.threshold;
  item.unit = req.body.unit || item.unit;
  item.lastUpdated = Date.now();

  const updated = await item.save();
  await ActivityLog.create({ user: req.user._id, action: 'Inventory item updated', details: updated.itemName });
  res.json(updated);
});

const deleteInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  await item.deleteOne();
  await ActivityLog.create({ user: req.user._id, action: 'Inventory item deleted', details: item.itemName });
  res.json({ message: 'Inventory item removed' });
});

const getLowStockItems = asyncHandler(async (req, res) => {
  const items = await Inventory.find({ $expr: { $lte: ['$quantity', '$threshold'] } });
  res.json(items);
});

module.exports = { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem, getLowStockItems };
