import { createHash } from "node:crypto";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (
      typeof token !== "string" ||
      !/^[a-f0-9]{64}$/.test(token) ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { message: "This password reset link is invalid or expired." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const user = await prisma.user.findUnique({
      where: { passwordResetTokenHash: tokenHash },
      select: { id: true, passwordResetExpires: true },
    });

    if (!user?.passwordResetExpires || user.passwordResetExpires <= new Date()) {
      return NextResponse.json(
        { message: "This password reset link is invalid or expired." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await prisma.user.updateMany({
      where: {
        id: user.id,
        passwordResetTokenHash: tokenHash,
        passwordResetExpires: { gt: new Date() },
      },
      data: {
        password: hashedPassword,
        passwordResetTokenHash: null,
        passwordResetExpires: null,
      },
    });

    if (result.count !== 1) {
      return NextResponse.json(
        { message: "This password reset link is invalid or expired." },
        { status: 400 },
      );
    }

    return NextResponse.json({ message: "Your password has been updated." });
  } catch {
    return NextResponse.json(
      { message: "We could not reset your password right now." },
      { status: 500 },
    );
  }
}
