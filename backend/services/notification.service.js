const nodemailer = require('nodemailer');

// Use environment variables
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = {
  sendEmail: async (to, subject, text) => {
    try {
      await transporter.sendMail({
        from: `"NkwaPay" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        text,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Email error:', error);
      throw new Error('Failed to send email');
    }
  },
};
