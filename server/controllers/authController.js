const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/userModel');
const generateToken = require('../utils/token');
const ActivityLog = require('../models/activityLogModel');
const sendEmail = require('../utils/mailer');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = asyncHandler(async (req, res) => {
  const { name, password, phone, address } = req.body;
  const email = req.body.email?.toLowerCase();
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed, phone, address });

  await ActivityLog.create({ user: user._id, action: 'User registered', details: `New customer ${user.email}` });

  try {
    await sendEmail({
      to: user.email,
      subject: 'Welcome to CleanWash Laundry Hub',
      html: `
        <p>Hello ${user.name},</p>
        <p>Your customer account has been created successfully.</p>
        <p>You can now log in using this email address.</p>
        <p>Thank you for choosing CleanWash.</p>
      `,
    });
  } catch (emailError) {
    console.error('Failed to send welcome email to customer:', emailError);
  }

  res.status(201).json({
    token: generateToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePhoto: user.profilePhoto },
  });
});

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, password, phone, address } = req.body;
  const email = req.body.email?.toLowerCase();
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed, phone, address, role: 'admin' });

  await ActivityLog.create({ user: user._id, action: 'Admin registered', details: `New admin ${user.email}` });

  try {
    await sendEmail({
      to: user.email,
      subject: 'Admin Access Granted - CleanWash Laundry Hub',
      html: `
        <p>Hello ${user.name},</p>
        <p>Your admin account has been created successfully.</p>
        <p>You can now log in and manage the CleanWash platform.</p>
        <p>If you did not request this account, please contact support immediately.</p>
      `,
    });
  } catch (emailError) {
    console.error('Failed to send admin notification email:', emailError);
  }

  res.status(201).json({
    token: generateToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePhoto: user.profilePhoto },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const email = req.body.email?.toLowerCase();
  const { password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.password) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  await ActivityLog.create({ user: user._id, action: 'Customer login', details: `Login from ${user.email}` });

  res.json({
    token: generateToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePhoto: user.profilePhoto },
  });
});

const googleSignIn = asyncHandler(async (req, res) => {
  const { tokenId } = req.body;
  const ticket = await client.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  const { email, name, picture, sub } = payload;

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, profilePhoto: picture, googleId: sub });
  }

  await ActivityLog.create({ user: user._id, action: 'Google sign in', details: `Google auth for ${email}` });

  res.json({
    token: generateToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePhoto: user.profilePhoto },
  });
});

module.exports = { registerUser, registerAdmin, loginUser, googleSignIn };
