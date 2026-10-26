export function canSendPasswordResetEmail() {
  const hasEmailSettings =
    Boolean(process.env.RESEND_API_KEY) && Boolean(process.env.EMAIL_FROM);
  const hasAppUrl =
    Boolean(process.env.APP_URL) || process.env.NODE_ENV !== "production";

  return hasAppUrl && (hasEmailSettings || process.env.NODE_ENV !== "production");
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Password reset email settings are missing");
    }

    console.info("Password reset link (development only): " + resetUrl);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Reset your Movie Hub password",
      html:
        '<p>We received a request to reset your Movie Hub password.</p>' +
        '<p><a href="' +
        resetUrl +
        '">Choose a new password</a></p>' +
        "<p>This link expires in one hour. If you did not request it, you can ignore this email.</p>",
    }),
  });

  if (!response.ok) {
    throw new Error("Password reset email could not be sent");
  }
}
