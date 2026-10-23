import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ reviewId: string }> };

const fail = (message: string, status: number) =>
  NextResponse.json({ message }, { status });

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { user, error } = verifyAuth(req);
  if (error) return error;

  const userId = (user as { id: number }).id;
  const reviewId = Number((await params).reviewId);
  if (!Number.isSafeInteger(reviewId) || reviewId < 1) {
    return fail("Review not found", 404);
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true },
    });

    if (!review) return fail("Review not found", 404);
    if (review.userId !== userId) {
      return fail("Only the review owner can delete this review", 403);
    }

    // The database removes its comments and helpful votes too.
    await prisma.review.delete({ where: { id: reviewId } });
    return NextResponse.json({ deleted: true });
  } catch {
    return fail("Unable to delete review", 500);
  }
}
