const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // true only for 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Optional: test SMTP on server start
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP error:", error);
  } else {
    console.log("✅ SMTP ready to send emails");
  }
});

const sendEmail = async (to, subject, html) => {
  return transporter.sendMail({
    from: '"DoodlePad" <no-reply@doodlepad.in>',
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
