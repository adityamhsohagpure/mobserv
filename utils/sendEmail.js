const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, token) => {
  // Render uses https, local uses http
  const baseUrl = process.env.NODE_ENV === "production" 
    ? "https://mobserv-0din.onrender.com" 
    : "http://localhost:5000";

  const verificationLink = `${baseUrl}/api/auth/verify/${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev", // ⚠️ Update this once you verify your domain
    to: email,
    subject: "Verify your email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: #333;">Welcome to Our App!</h2>
        <p>Please click the button below to verify your email address:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p style="margin-top: 20px; font-size: 12px; color: #777;">If the button doesn't work, copy this link: <br> ${verificationLink}</p>
      </div>
    `,
  });
};

module.exports = sendEmail;