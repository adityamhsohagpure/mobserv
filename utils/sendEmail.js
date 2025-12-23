const nodemailer = require("nodemailer");

const sendEmail = async (email, token) => {
  const verifyLink = `${process.env.BASE_URL}/api/auth/verify/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "adityamhsohagpure999@gmail.com",
      pass: "jobz qhxf ffus ekta",
    },
  });

  const mailOptions = {
  from: '"Doodlepad" <adityamhsohagpure999@gmail.com>',
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyLink}" target="_blank">
        Verify Email
      </a>
      <p>This link expires in 1 hour.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
