const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, token) => {
  const baseUrl = process.env.NODE_ENV === "production" 
    ? "https://mobserv-0din.onrender.com" 
    : "http://localhost:5000";

  const verificationLink = `${baseUrl}/api/auth/verify/${token}`;

  // Destructure { data, error } from the response
  const { data, error } = await resend.emails.send({
    from:  "Doodlepad <noreply@doodlepad.in>",//✅ VERIFIED DOMAIN
    to: email, 
    subject: "Verify your email",
    html: `<p>Click <a href="${verificationLink}">here</a> to verify.</p>`,
  });

  // 🔥 CRITICAL: If Resend returned an error, throw it!
  if (error) {
    throw new Error(error.message || "Resend API Error");
  }

  return data;
};

module.exports = sendEmail;