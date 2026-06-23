const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const ActivityLog = require('../models/activityLogModel');
const sendEmail = require('../utils/mailer');
const cloudinary = require('../utils/cloudinary');
const { buildEmailTemplate } = require('../utils/emailTemplate');

const getUserProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.address = req.body.address || user.address;

  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 12);
  }

  if (req.body.profilePhoto) {
    const upload = await cloudinary.uploader.upload(req.body.profilePhoto, {
      folder: 'cleanwash/profile',
      transformation: [{ width: 600, height: 600, crop: 'fill' }],
    });
    user.profilePhoto = upload.secure_url;
  }

  const updated = await user.save();
  await ActivityLog.create({ user: user._id, action: 'Profile updated', details: 'Customer updated profile information' });

  await Notification.create({
    recipient: user._id,
    subject: 'Profile updated',
    message: 'Your profile information was updated successfully.',
    type: 'account',
  });

  await sendEmail({
    to: user.email,
    subject: 'Profile Updated - CleanWash Laundry Hub',
    html: buildEmailTemplate({
      preheader: 'Your profile information has been updated.',
      title: 'Profile updated',
      bodyHtml: `
        <p style="margin: 0 0 16px;">Hello ${user.name},</p>
        <p style="margin: 0;">Your profile has been successfully updated.</p>
      `,
      ctaText: 'Go to profile',
      ctaUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/customer/profile`,
      accent: '#0f766e',
    }),
  });

  res.json({ message: 'Profile updated successfully', user: updated });
});

const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: 'customer' }).select('-password');
  res.json(customers);
});

module.exports = { getUserProfile, updateUserProfile, getAllCustomers };
