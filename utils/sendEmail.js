const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,   // your Gmail
      pass: process.env.EMAIL_PASS,   // App password (not your real password)
    }
  });

  await transporter.sendMail({
    from: `"MyApp" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html,
  });
};

module.exports = sendEmail;
