const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discount: { type: Number, required: true }, // percentage or fixed amount
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  maxUses: { type: Number },
  currentUses: { type: Number, default: 0 },
  minOrderValue: { type: Number, default: 0 },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  active: { type: Boolean, default: true },
  applicableServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LaundryService' }],
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PromoCode', promoCodeSchema);
