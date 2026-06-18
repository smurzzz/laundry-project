const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'LaundryOrder' },
  read: { type: Boolean, default: false },
  type: { type: String, default: 'order' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
