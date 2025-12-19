const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// check SMTP connection on startup
transporter.verify(err => {
  if (err) {
    console.error("❌ SMTP error:", err.message);
  } else {
    console.log("✅ SMTP ready to send emails");
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    return await transporter.sendMail({
      from: `"DoodlePad" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("📨 SMTP SEND ERROR:", err.message);
    throw err;
  }
};

module.exports = sendEmail;
