const asyncHandler = require('express-async-handler');
const ActivityLog = require('../models/activityLogModel');

const getActivityLogs = asyncHandler(async (req, res) => {
  const logs = await ActivityLog.find({}).populate('user', 'name email').populate('order', 'orderNumber').sort({ createdAt: -1 }).limit(100);
  res.json(logs);
});

module.exports = { getActivityLogs };
