import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, text }) => {
  try {
    await sgMail.send({
      to,
      from: process.env.EMAIL_FROM,
      subject,
      text,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Email error:", err.message);
    }
    throw err;
  }
};