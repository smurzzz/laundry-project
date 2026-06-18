const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  profilePhoto: { type: String },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  phone: { type: String },
  address: { type: String },
  googleId: { type: String },
  registeredAt: { type: Date, default: Date.now },
  ratings: [
    {
      score: { type: Number, min: 1, max: 5 },
      comment: { type: String },
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
