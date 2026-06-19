const PDFDocument = require('pdfkit');

const generateReceipt = (order) => {
  const doc = new PDFDocument({ margin: 40 });
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('end', () => {});

  doc.fontSize(20).text('CleanWash Laundry Hub', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Order #: ${order.orderNumber}`);
  doc.text(`Customer: ${order.customer.name}`);
  doc.text(`Email: ${order.customer.email}`);
  doc.text(`Status: ${order.status}`);
  doc.text(`Created: ${new Date(order.createdAt).toLocaleString()}`);
  doc.moveDown();
  doc.fontSize(16).text('Items');

  order.items.forEach((item) => {
    doc.fontSize(12).text(`${item.quantity} x ${item.service.name} - ₱${item.unitPrice.toFixed(2)}`);
    if (item.instructions) {
      doc.fontSize(10).fillColor('gray').text(`Instructions: ${item.instructions}`);
    }
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total: ₱${order.totalAmount.toFixed(2)}`);
  doc.moveDown();
  doc.fontSize(10).fillColor('gray').text('Thank you for choosing CleanWash Laundry Hub.');
  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });
};

module.exports = { generateReceipt };
