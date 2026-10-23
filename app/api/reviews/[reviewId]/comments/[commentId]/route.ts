import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ reviewId: string; commentId: string }>;
};

const fail = (message: string, status: number) =>
  NextResponse.json({ message }, { status });

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { user, error } = verifyAuth(req);
  if (error) return error;

  const userId = (user as { id: number }).id;
  const { reviewId: reviewIdValue, commentId: commentIdValue } = await params;
  const reviewId = Number(reviewIdValue);
  const commentId = Number(commentIdValue);

  if (
    !Number.isSafeInteger(reviewId) ||
    reviewId < 1 ||
    !Number.isSafeInteger(commentId) ||
    commentId < 1
  ) {
    return fail("Comment not found", 404);
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        reviewId: true,
        userId: true,
        review: { select: { userId: true } },
      },
    });

    if (!comment || comment.reviewId !== reviewId) {
      return fail("Comment not found", 404);
    }

    const canDelete = comment.userId === userId || comment.review.userId === userId;
    if (!canDelete) {
      return fail("Only the comment owner or review owner can delete this comment", 403);
    }

    await prisma.comment.delete({ where: { id: commentId } });
    return NextResponse.json({ deleted: true });
  } catch {
    return fail("Unable to delete comment", 500);
  }
}
