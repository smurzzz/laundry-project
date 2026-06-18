const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true, unique: true },
  category: { type: String, default: 'Cleaning' },
  quantity: { type: Number, required: true, min: 0 },
  threshold: { type: Number, default: 5 },
  unit: { type: String, default: 'pcs' },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Inventory', inventorySchema);
