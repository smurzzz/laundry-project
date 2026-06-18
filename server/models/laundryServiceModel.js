const mongoose = require('mongoose');

const laundryServiceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ['Wash', 'Dry Clean', 'Iron', 'Express', 'Special'],
    default: 'Wash',
  },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  duration: { type: String },
  options: [
    {
      name: { type: String, required: true },
      priceAdjustment: { type: Number, default: 0 },
      description: { type: String },
    },
  ],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LaundryService', laundryServiceSchema);
