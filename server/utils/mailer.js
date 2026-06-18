const nodemailer = require('nodemailer');

const isSmtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const transport = isSmtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

const sendEmail = async ({ to, subject, html }) => {
  if (!isSmtpConfigured || !transport) {
    console.warn('SMTP is not configured. Skipping email send.');
    return;
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
  };
  return transport.sendMail(mailOptions);
};

module.exports = sendEmail;
