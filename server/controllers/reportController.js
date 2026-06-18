const asyncHandler = require('express-async-handler');
const ExcelJS = require('exceljs');
const LaundryOrder = require('../models/laundryOrderModel');
const User = require('../models/userModel');

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const totalOrders = await LaundryOrder.countDocuments({});
  const revenue = await LaundryOrder.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);
  const monthlyOrders = await LaundryOrder.aggregate([
    { $match: {} },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, total: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    totalCustomers,
    totalOrders,
    revenue: revenue[0]?.total || 0,
    monthlyOrders,
  });
});

const exportOrdersExcel = asyncHandler(async (req, res) => {
  const orders = await LaundryOrder.find({}).populate('customer', 'name email');
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Orders');

  sheet.columns = [
    { header: 'Order #', key: 'orderNumber', width: 25 },
    { header: 'Customer', key: 'customer', width: 30 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Status', key: 'status', width: 20 },
    { header: 'Total', key: 'totalAmount', width: 15 },
    { header: 'Created', key: 'createdAt', width: 25 },
  ];

  orders.forEach((order) => {
    sheet.addRow({
      orderNumber: order.orderNumber,
      customer: order.customer?.name,
      email: order.customer?.email,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt.toISOString(),
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=cleanwash-orders.xlsx');
  await workbook.xlsx.write(res);
  res.end();
});

module.exports = { getDashboardStats, exportOrdersExcel };
