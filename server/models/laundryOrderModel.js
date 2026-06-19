const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'LaundryService' },
  inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
  itemType: { type: String, enum: ['Service', 'Inventory'] },
  name: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  instructions: { type: String },
  unitPrice: { type: Number, required: true, min: 0 },
  option: {
    name: { type: String },
    priceAdjustment: { type: Number, default: 0 },
    description: { type: String },
  },
});

const laundryOrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: [
      'Pending',
      'Confirmed',
      'Washing',
      'Drying',
      'Folding',
      'Ready for Pickup',
      'Out for Delivery',
      'Completed',
      'Cancelled',
    ],
    default: 'Pending',
  },
  totalAmount: { type: Number, required: true, min: 0 },
  pickupType: { type: String, enum: ['Delivery', 'Pickup'], default: 'Pickup' },
  deliveryAddress: { type: String },
  customerNotes: { type: String },
  assignedDriver: { type: String },
  estimatedPickup: { type: Date },
  estimatedDelivery: { type: Date },
  orderNumber: { type: String, unique: true },
  invoiceUrl: { type: String },
  qrCode: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

laundryOrderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (!this.orderNumber) {
    this.orderNumber = `CW-${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('LaundryOrder', laundryOrderSchema);
