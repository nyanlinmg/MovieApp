import { verifyAuth } from "@/middleware/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ reviewId: string }> };

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { user, error } = verifyAuth(req);
  if (error) return error;

  const userId = (user as { id: number }).id;
  const reviewId = Number((await params).reviewId);

  if (!Number.isSafeInteger(reviewId) || reviewId < 1) {
    return NextResponse.json({ message: "Review not found" }, { status: 404 });
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, userId: true },
    });

    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }
    if (review.userId === userId) {
      return NextResponse.json(
        { message: "You can't mark your own review as helpful" },
        { status: 400 },
      );
    }

    const existingLike = await prisma.reviewLike.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
      select: { id: true },
    });

    if (existingLike) {
      await prisma.reviewLike.delete({ where: { id: existingLike.id } });
    } else {
      await prisma.reviewLike.create({ data: { userId, reviewId } });
    }

    return NextResponse.json({ isHelpful: !existingLike });
  } catch {
    return NextResponse.json(
      { message: "Unable to update helpful vote" },
      { status: 500 },
    );
  }
}
