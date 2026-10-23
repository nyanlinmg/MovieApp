import { MediaType } from "@/generated/prisma-client/enums";
import { verifyAuth } from "@/middleware/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const fail = (message: string, status: number) =>
  NextResponse.json({ message }, { status });

function getMediaType(value: unknown): MediaType | null {
  if (value === "movie") return MediaType.movie;
  if (value === "tv") return MediaType.tv;
  return null;
}

export async function GET(req: NextRequest) {
  const tmdbId = Number(req.nextUrl.searchParams.get("tmdbId"));
  const mediaType = getMediaType(req.nextUrl.searchParams.get("mediaType"));

  if (!Number.isSafeInteger(tmdbId) || tmdbId < 1 || !mediaType) {
    return fail("A valid title and media type are required", 400);
  }

  // Reading reviews is public. A token is only needed to show the viewer's own likes.
  let viewerId: number | null = null;
  if (req.headers.has("authorization")) {
    const { user, error } = verifyAuth(req);
    if (!error) viewerId = (user as { id: number }).id;
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { tmdbId, mediaType },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, username: true } },
        _count: { select: { likes: true, comments: true } },
        likes: {
          where: { userId: viewerId ?? -1 },
          select: { id: true },
        },
      },
    });

    return NextResponse.json({
      reviews: reviews.map(({ _count, likes, ...review }) => ({
        ...review,
        helpfulCount: _count.likes,
        commentsCount: _count.comments,
        isHelpful: likes.length > 0,
      })),
    });
  } catch {
    return fail("Unable to load reviews", 500);
  }
}

export async function POST(req: NextRequest) {
  const { user, error } = verifyAuth(req);
  if (error) return error;

  const userId = (user as { id: number }).id;

  try {
    const body = await req.json();
    const tmdbId = Number(body?.tmdbId);
    const mediaType = getMediaType(body?.mediaType);
    const rating = Number(body?.rating);
    const content = typeof body?.content === "string" ? body.content.trim() : "";

    if (!Number.isSafeInteger(tmdbId) || tmdbId < 1 || !mediaType) {
      return fail("A valid title and media type are required", 400);
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
      return fail("Choose a rating from 1 to 10", 400);
    }
    if (!content || content.length > 2000) {
      return fail("Write a review of up to 2,000 characters", 400);
    }

    // Each person has one review per title; posting again updates that review.
    const review = await prisma.review.upsert({
      where: {
        userId_tmdbId_mediaType: { userId, tmdbId, mediaType },
      },
      create: { userId, tmdbId, mediaType, rating, content },
      update: { rating, content },
    });

    return NextResponse.json({ review });
  } catch {
    return fail("Unable to save your review", 500);
  }
}
