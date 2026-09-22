import nodemailer from "nodemailer";

const sendEmailWithBrevo = async ({ to, subject, text, html }) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: process.env.SMTP_FROM_NAME,
        email: process.env.SMTP_FROM_EMAIL,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      textContent: text,
      htmlContent: html,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Brevo email error:", data);
    throw new Error(data.message || "Failed to send email");
  }

  console.log("Email sent successfully:", data.messageId);

  return data;
};

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
  // Railway has BREVO_API_KEY, so use Brevo HTTPS API.
  if (process.env.BREVO_API_KEY) {
    return await sendEmailWithBrevo({
      to,
      subject,
      text,
      html,
    });
  }

  // Local development: use existing SMTP.
  return await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    text,
    html,
  });
};

if (process.env.NODE_ENV !== "production" && !process.env.BREVO_API_KEY) {
  transporter
    .verify()
    .then(() => {
      console.log("SMTP connection verified successfully.");
    })
    .catch((error) => {
      console.error("SMTP connection verification failed:", error);
    });
}
