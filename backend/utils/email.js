import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    text,
    html,
  });

  return info;
};

if (process.env.NODE_ENV !== "production") {
  transporter
    .verify()
    .then(() => {
      console.log("SMTP connection verified successfully.");
    })
    .catch((error) => {
      console.error("SMTP connection verification failed:", error);
    });
}
