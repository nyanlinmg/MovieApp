import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import {
  canSendPasswordResetEmail,
  sendPasswordResetEmail,
} from "@/lib/password-reset-email";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GENERIC_MESSAGE =
  "If an account exists for that email, we sent a password reset link.";

export async function POST(request: NextRequest) {
  if (!canSendPasswordResetEmail()) {
    return NextResponse.json(
      { message: "Password reset email is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const { email } = await request.json();

    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { message: "Enter a valid email address." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim() },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ message: GENERIC_MESSAGE });
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpires: expiresAt,
      },
    });

    const appUrl = (
      process.env.APP_URL || request.nextUrl.origin
    ).replace(/\/+$/, "");
    const resetUrl =
      appUrl + "/reset-password?token=" + encodeURIComponent(token);

    await sendPasswordResetEmail(user.email, resetUrl);

    const isLocalEmailFallback =
      process.env.NODE_ENV !== "production" &&
      (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM);

    return NextResponse.json({
      message: GENERIC_MESSAGE,
      ...(isLocalEmailFallback ? { resetUrl } : {}),
    });
  } catch (error) {
    console.error("Password reset request failed", error);
    return NextResponse.json(
      { message: "We could not process your request right now." },
      { status: 500 },
    );
  }
}
