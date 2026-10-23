import { verifyAuth } from "@/middleware/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ reviewId: string }> };

const fail = (message: string, status: number) =>
  NextResponse.json({ message }, { status });

function readReviewId(value: string) {
  const reviewId = Number(value);
  return Number.isSafeInteger(reviewId) && reviewId > 0 ? reviewId : null;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const reviewId = readReviewId((await params).reviewId);
  if (!reviewId) return fail("Review not found", 404);

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: {
        comments: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: { select: { id: true, name: true, username: true } },
          },
        },
      },
    });

    if (!review) return fail("Review not found", 404);
    return NextResponse.json({ comments: review.comments });
  } catch {
    return fail("Unable to load comments", 500);
  }
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { user, error } = verifyAuth(req);
  if (error) return error;

  const userId = (user as { id: number }).id;
  const reviewId = readReviewId((await params).reviewId);
  if (!reviewId) return fail("Review not found", 404);

  let body: { content?: unknown };
  try {
    body = await req.json();
  } catch {
    return fail("Write a comment before posting", 400);
  }

  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!content || content.length > 1000) {
    return fail("Write a comment of up to 1,000 characters", 400);
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true },
    });
    if (!review) return fail("Review not found", 404);

    const comment = await prisma.comment.create({
      data: { userId, reviewId, content },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: { select: { id: true, name: true, username: true } },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch {
    return fail("Unable to post your comment", 500);
  }
}
