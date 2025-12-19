const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendEmail(to, subject, html) {
  try {
    return await emailApi.sendTransacEmail({
      sender: { email: process.env.MAIL_SENDER },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });
  } catch (err) {
    console.error("❌ Brevo API Email Error:", err.response?.body || err);
    throw err;
  }
}

module.exports = sendEmail;
