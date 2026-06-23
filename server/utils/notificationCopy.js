const STATUS_LABELS = {
  Pending: 'pending review',
  Confirmed: 'confirmed',
  Washing: 'now being washed',
  Drying: 'currently drying',
  Folding: 'being folded',
  'Ready for Pickup': 'ready for pickup',
  'Out for Delivery': 'out for delivery',
  Completed: 'completed',
  Cancelled: 'cancelled',
};

const buildOrderNotification = (orderNumber, status) => {
  const label = STATUS_LABELS[status] || status.toLowerCase();
  return {
    subject: `Order update for ${orderNumber}`,
    message: `Your order ${orderNumber} is ${label}. We'll keep you posted as it moves forward.`,
  };
};

module.exports = { buildOrderNotification };
