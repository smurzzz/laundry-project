const asyncHandler = require('express-async-handler');
const cloudinary = require('../utils/cloudinary');
const Inventory = require('../models/inventoryModel');
const ActivityLog = require('../models/activityLogModel');

const normalizeCategory = (category) => {
  if (!category) return 'Cleaning';
  const cleaned = category.trim();
  if (/^products?$/i.test(cleaned)) return 'Product';
  return cleaned;
};

const getInventory = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) {
    const category = normalizeCategory(req.query.category);
    filter.category = { $regex: `^${category}$`, $options: 'i' };
  }
  const items = await Inventory.find(filter).sort({ itemName: 1 });
  res.json(items);
});

const createInventoryItem = asyncHandler(async (req, res) => {
  const { itemName, category, description, price, imageUrl, quantity, threshold, unit } = req.body;
  const existing = await Inventory.findOne({ itemName });
  if (existing) {
    res.status(400);
    throw new Error('Inventory item already exists');
  }

  let uploadedImage = imageUrl;
  if (imageUrl && imageUrl.startsWith('data:')) {
    const upload = await cloudinary.uploader.upload(imageUrl, {
      folder: 'cleanwash/inventory',
    });
    uploadedImage = upload.secure_url;
  }

  const item = await Inventory.create({
    itemName,
    category: normalizeCategory(category),
    description,
    price,
    imageUrl: uploadedImage,
    quantity,
    threshold,
    unit,
  });
  await ActivityLog.create({ user: req.user._id, action: 'Inventory item created', details: itemName });
  res.status(201).json(item);
});

const updateInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  const { category, description, price, imageUrl, quantity, threshold, unit } = req.body;
  item.category = category ? normalizeCategory(category) : item.category;
  item.description = description ?? item.description;
  item.price = price ?? item.price;
  item.quantity = quantity ?? item.quantity;
  item.threshold = threshold ?? item.threshold;
  item.unit = unit || item.unit;

  if (imageUrl) {
    if (imageUrl.startsWith('data:')) {
      const upload = await cloudinary.uploader.upload(imageUrl, {
        folder: 'cleanwash/inventory',
      });
      item.imageUrl = upload.secure_url;
    } else {
      item.imageUrl = imageUrl;
    }
  }

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
