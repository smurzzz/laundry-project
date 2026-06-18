const asyncHandler = require('express-async-handler');
const SupportTicket = require('../models/supportTicketModel');
const ActivityLog = require('../models/activityLogModel');

const createTicket = asyncHandler(async (req, res) => {
  const { subject, description, category, orderId } = req.body;
  const userId = req.user.id;

  if (!subject || !description) {
    res.status(400);
    throw new Error('Subject and description required');
  }

  const ticket = await SupportTicket.create({
    user: userId,
    order: orderId || null,
    subject,
    description,
    category,
  });

  await ActivityLog.create({ user: userId, action: 'Support ticket created', details: `Ticket #${ticket._id}: ${subject}` });

  res.status(201).json(ticket);
});

const getMyTickets = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const tickets = await SupportTicket.find({ user: userId })
    .populate('user', 'name email')
    .populate('order')
    .sort({ createdAt: -1 });
  res.json(tickets);
});

const getAllTickets = asyncHandler(async (req, res) => {
  const { status, priority } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const tickets = await SupportTicket.find(filter)
    .populate('user', 'name email')
    .populate('order')
    .sort({ createdAt: -1 });
  res.json(tickets);
});

const getTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ticket = await SupportTicket.findById(id).populate('user', 'name email').populate('order');

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  res.json(ticket);
});

const addMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  if (!text) {
    res.status(400);
    throw new Error('Message text required');
  }

  const ticket = await SupportTicket.findByIdAndUpdate(
    id,
    {
      $push: { messages: { sender: userId, text } },
      updatedAt: Date.now(),
    },
    { new: true }
  ).populate('messages.sender', 'name email');

  res.json(ticket);
});

const updateTicketStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, priority } = req.body;

  const ticket = await SupportTicket.findByIdAndUpdate(
    id,
    { ...(status && { status }), ...(priority && { priority }), updatedAt: Date.now() },
    { new: true }
  );

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  res.json(ticket);
});

const closeTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ticket = await SupportTicket.findByIdAndUpdate(id, { status: 'closed', updatedAt: Date.now() }, { new: true });

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  res.json(ticket);
});

module.exports = { createTicket, getMyTickets, getAllTickets, getTicket, addMessage, updateTicketStatus, closeTicket };
