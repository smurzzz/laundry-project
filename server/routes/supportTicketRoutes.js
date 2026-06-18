const express = require('express');
const { createTicket, getMyTickets, getAllTickets, getTicket, addMessage, updateTicketStatus, closeTicket } = require('../controllers/supportTicketController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createTicket);
router.get('/my-tickets', protect, getMyTickets);
router.get('/', protect, authorize('admin'), getAllTickets);
router.get('/:id', protect, getTicket);
router.post('/:id/message', protect, addMessage);
router.patch('/:id/status', protect, authorize('admin'), updateTicketStatus);
router.patch('/:id/close', protect, closeTicket);

module.exports = router;
