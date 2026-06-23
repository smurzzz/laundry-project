const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/userModel');
const generateToken = require('../utils/token');
const ActivityLog = require('../models/activityLogModel');
const sendEmail = require('../utils/mailer');
const { buildEmailTemplate } = require('../utils/emailTemplate');

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
      html: buildEmailTemplate({
        preheader: 'Your customer account is ready.',
        title: 'Welcome to CleanWash',
        bodyHtml: `
          <p style="margin: 0 0 16px;">Hello ${user.name},</p>
          <p style="margin: 0 0 16px;">Your customer account has been created successfully.</p>
          <p style="margin: 0;">You can now log in using this email address and start managing your laundry orders.</p>
        `,
        ctaText: 'Go to login',
        ctaUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login`,
      }),
    });
  } catch (emailError) {
    console.error('Failed to send welcome email to customer:', emailError);
  }

  res.status(201).json({
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      profilePhoto: user.profilePhoto,
    },
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
      html: buildEmailTemplate({
        preheader: 'Your admin account has been activated.',
        title: 'Admin access granted',
        bodyHtml: `
          <p style="margin: 0 0 16px;">Hello ${user.name},</p>
          <p style="margin: 0 0 16px;">Your admin account has been created successfully.</p>
          <p style="margin: 0;">You can now log in and manage the CleanWash platform.</p>
        `,
        ctaText: 'Open admin login',
        ctaUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/login`,
        accent: '#0f766e',
      }),
    });
  } catch (emailError) {
    console.error('Failed to send admin notification email:', emailError);
  }

  res.status(201).json({
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      profilePhoto: user.profilePhoto,
    },
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
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      profilePhoto: user.profilePhoto,
    },
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
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      profilePhoto: user.profilePhoto,
    },
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const email = req.body.email?.toLowerCase();

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      message: 'If an account exists for that email, a password reset link has been sent.',
    });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetPasswordExpire = Date.now() + 1000 * 60 * 30;

  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpire = resetPasswordExpire;
  await user.save();

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl.replace(/\/$/, '')}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your CleanWash password',
      html: buildEmailTemplate({
        preheader: 'Use this secure link to set a new password.',
        title: 'Reset your password',
        badge: 'Security alert',
        introHtml: `
          <div style="margin: 0 0 18px; padding: 16px; border-radius: 18px; background: linear-gradient(180deg, #ecfeff 0%, #f8fafc 100%); border: 1px solid #c4f1f9;">
            <p style="margin: 0; font-size: 14px; font-weight: 700; color: #0f766e; text-transform: uppercase; letter-spacing: 0.08em;">Password reset requested</p>
            <p style="margin: 8px 0 0; font-size: 15px; color: #334155;">We received a request to reset your CleanWash password. Use the secure button below to continue.</p>
          </div>
        `,
        bodyHtml: `
          <p style="margin: 0 0 16px;">Hello ${user.name},</p>
          <p style="margin: 0 0 16px;">This link expires in 30 minutes and can only be used once.</p>
          <div style="margin: 22px 0 0; padding: 14px 16px; border-radius: 16px; background: #f8fafc; border: 1px dashed #cbd5e1;">
            <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569;">If the button does not work, copy and paste the link below into your browser:</p>
            <p style="margin: 10px 0 0; word-break: break-all; font-size: 12px; line-height: 1.6; color: #0f172a;">${resetUrl}</p>
          </div>
          <p style="margin: 18px 0 0; font-size: 13px; color: #64748b;">If you did not request a password reset, you can safely ignore this email.</p>
        `,
        ctaText: 'Reset password',
        ctaUrl: resetUrl,
        accent: '#0ea5e9',
        footerNote: 'For your security, this link expires after 30 minutes and can only be used once.',
      }),
    });
  } catch (emailError) {
    console.error('Failed to send password reset email:', emailError);
    res.status(500);
    throw new Error('Unable to send reset email right now');
  }

  res.json({
    message: 'If an account exists for that email, a password reset link has been sent.',
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    res.status(400);
    throw new Error('Token and new password are required');
  }

  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Password reset link is invalid or has expired');
  }

  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  await ActivityLog.create({
    user: user._id,
    action: 'Password reset',
    details: `Password updated for ${user.email}`,
  });

  try {
    await sendEmail({
      to: user.email,
      subject: 'Your CleanWash password was changed',
      html: buildEmailTemplate({
        preheader: 'Your password has been updated successfully.',
        title: 'Password updated',
        bodyHtml: `
          <p style="margin: 0 0 16px;">Hello ${user.name},</p>
          <p style="margin: 0 0 16px;">Your password was successfully changed.</p>
          <p style="margin: 0;">If this was not you, please contact support immediately.</p>
        `,
        ctaText: 'Back to login',
        ctaUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login`,
        accent: '#155e75',
      }),
    });
  } catch (emailError) {
    console.error('Failed to send password change confirmation email:', emailError);
  }

  res.json({ message: 'Password updated successfully' });
});

module.exports = { registerUser, registerAdmin, loginUser, googleSignIn, forgotPassword, resetPassword };
