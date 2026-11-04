const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      throw new Error("BREVO_API_KEY is not configured");
    }

    if (!to || !subject || (!text && !html)) {
      throw new Error("Recipient, subject, and email content are required");
    }

    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: process.env.SMTP_FROM_NAME || "ShopEase",
          email: process.env.SMTP_FROM_EMAIL,
        },
        to: [{ email: to }],
        subject,
        ...(text && { textContent: text }),
        ...(html && { htmlContent: html }),
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Brevo API error:", result);

      throw new Error(
        result.message || `Brevo email request failed: ${response.status}`,
      );
    }

    console.log("Email accepted by Brevo:", result.messageId);

    return result;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};
