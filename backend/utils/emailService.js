import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, text }) => {
  try {
    await sgMail.send({
      to,
      from: process.env.EMAIL_FROM, // verified sender
      subject,
      text,
    });
    console.log("📧 Email sent to:", to);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
};