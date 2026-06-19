const asyncHandler = require('express-async-handler');
const qrcode = require('qrcode');
const LaundryOrder = require('../models/laundryOrderModel');
const LaundryService = require('../models/laundryServiceModel');
const Inventory = require('../models/inventoryModel');
const Notification = require('../models/notificationModel');
const ActivityLog = require('../models/activityLogModel');
const sendEmail = require('../utils/mailer');
const { generateReceipt } = require('../utils/pdfGenerator');

const createOrder = asyncHandler(async (req, res) => {
  const { items, pickupType, deliveryAddress, customerNotes, assignedDriver, estimatedPickup, estimatedDelivery } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Order items are required');
  }

  const serviceItems = await Promise.all(
    items.map(async (item, index) => {
      try {
        const quantity = Number(item.quantity) || 1;
        const instructions = item.instructions || '';
        const option = item.option || null;

        // Validate quantity
        if (quantity < 1) {
          throw new Error(`Item ${index + 1}: quantity must be at least 1`);
        }

        if (item.inventoryId) {
          const inventoryItem = await Inventory.findById(item.inventoryId);
          if (!inventoryItem) {
            throw new Error(`Invalid inventory selected for order item ${index + 1}`);
          }
          if (inventoryItem.quantity < quantity) {
            throw new Error(`Insufficient stock for ${inventoryItem.itemName}`);
          }

          const unitPrice = inventoryItem.price;
          await Inventory.findByIdAndUpdate(item.inventoryId, { $inc: { quantity: -quantity } });

          return {
            inventory: inventoryItem._id,
            itemType: 'Inventory',
            name: inventoryItem.itemName,
            quantity,
            instructions,
            unitPrice,
            option: null,
          };
        }

        if (item.serviceId) {
          const service = await LaundryService.findById(item.serviceId);
          if (!service) {
            throw new Error(`Invalid service selected for order item ${index + 1}`);
          }

          const selectedOption = item.option?.name && Array.isArray(service.options)
            ? service.options.find((opt) => opt.name === item.option.name) || item.option
            : item.option || null;
          const priceAdjustment = selectedOption?.priceAdjustment ?? 0;
          const unitPrice = service.price + priceAdjustment;

          return {
            service: service._id,
            itemType: 'Service',
            name: service.name,
            quantity,
            instructions,
            unitPrice,
            option: selectedOption,
          };
        }

        // Fallback for items sent with direct itemType and name
        if (item.itemType && item.name) {
          if (!['Service', 'Inventory'].includes(item.itemType)) {
            throw new Error(`Item ${index + 1}: itemType must be 'Service' or 'Inventory'`);
          }

          const unitPrice = Number(item.unitPrice) || Number(item.basePrice) || Number(item.price) || 0;
          if (unitPrice <= 0) {
            throw new Error(`Item ${index + 1}: unitPrice must be greater than 0`);
          }

          return {
            itemType: item.itemType,
            name: item.name,
            quantity,
            instructions,
            unitPrice,
            option: item.itemType === 'Service' ? option : null,
          };
        }

        throw new Error(`Invalid order item data at position ${index + 1}. Required fields: serviceId OR (itemType and name).`);
      } catch (err) {
        console.error(`Error processing item ${index + 1}:`, err.message);
        throw err;
      }
    })
  );

  const totalAmount = serviceItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const order = await LaundryOrder.create({
    customer: req.user._id,
    items: serviceItems,
    totalAmount,
    pickupType,
    deliveryAddress,
    customerNotes,
    assignedDriver,
    estimatedPickup,
    estimatedDelivery,
  });

  try {
    const qrCodeData = await qrcode.toDataURL(`${process.env.CLIENT_URL}/track/${order.orderNumber}`);
    order.qrCode = qrCodeData;
    await order.save();
  } catch (error) {
    console.error('Failed to generate QR code or save order QR data:', error);
  }

  try {
    await Notification.create({
      recipient: req.user._id,
      subject: 'Order Confirmation',
      message: `Your order ${order.orderNumber} has been received and is pending confirmation.`,
      order: order._id,
    });
  } catch (error) {
    console.error('Failed to create order notification:', error);
  }

  try {
    await sendEmail({
      to: req.user.email,
      subject: 'Order Confirmed - CleanWash Laundry Hub',
      html: `<p>Your order <strong>${order.orderNumber}</strong> has been created successfully.</p><p>We will notify you when the status updates.</p>`,
    });
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }

  try {
    await ActivityLog.create({ user: req.user._id, order: order._id, action: 'Order created', details: `Order ${order.orderNumber} created by customer` });
  } catch (error) {
    console.error('Failed to create activity log for order creation:', error);
  }

  res.status(201).json(order);
});

const getOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === 'customer') {
    filter.customer = req.user._id;
  }
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.search) {
    filter.orderNumber = { $regex: req.query.search, $options: 'i' };
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await LaundryOrder.find(filter)
    .populate('customer', 'name email')
    .populate('items.service', 'name price')
    .populate('items.inventory', 'itemName price imageUrl')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const count = await LaundryOrder.countDocuments(filter);

  res.json({ orders, page, pages: Math.ceil(count / limit), total: count });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await LaundryOrder.findById(req.params.id)
    .populate('customer', 'name email')
    .populate('items.service', 'name price')
    .populate('items.inventory', 'itemName price imageUrl');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (req.user.role === 'customer' && order.customer._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Forbidden');
  }

  res.json(order);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const validStatuses = ['Pending', 'Confirmed', 'Washing', 'Drying', 'Folding', 'Ready for Pickup', 'Out for Delivery', 'Completed', 'Cancelled'];
  
  if (req.body.status && !validStatuses.includes(req.body.status)) {
    res.status(400);
    throw new Error(`Invalid status. Valid statuses are: ${validStatuses.join(', ')}`);
  }

  const updateData = {};
  if (req.body.status) updateData.status = req.body.status;
  if (req.body.assignedDriver) updateData.assignedDriver = req.body.assignedDriver;
  if (req.body.estimatedDelivery) updateData.estimatedDelivery = req.body.estimatedDelivery;

  const order = await LaundryOrder.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: false }
  ).populate('customer', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  try {
    await Notification.create({
      recipient: order.customer._id,
      subject: 'Order Status Updated',
      message: `Your order ${order.orderNumber} is now ${order.status}.`,
      order: order._id,
    });
  } catch (error) {
    console.error('Failed to create status notification:', error.message);
  }

  try {
    if (order.customer.email) {
      await sendEmail({
        to: order.customer.email,
        subject: `Order ${order.status} - CleanWash Laundry Hub`,
        html: `<p>Your order <strong>${order.orderNumber}</strong> status has updated to <strong>${order.status}</strong>.</p>`,
      });
    }
  } catch (error) {
    console.error('Failed to send order status email:', error.message);
  }

  try {
    await ActivityLog.create({ user: req.user._id, order: order._id, action: 'Order status updated', details: `Status changed to ${order.status}` });
  } catch (error) {
    console.error('Failed to create activity log for order status update:', error.message);
  }

  res.json(order);
});

const getOrderReceipt = asyncHandler(async (req, res) => {
  const order = await LaundryOrder.findById(req.params.id)
    .populate('customer', 'name email')
    .populate('items.service', 'name');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (req.user.role === 'customer' && order.customer._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Forbidden');
  }

  const pdfBuffer = await generateReceipt(order);
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename=receipt-${order.orderNumber}.pdf`,
  });
  res.send(pdfBuffer);
});

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, getOrderReceipt };
