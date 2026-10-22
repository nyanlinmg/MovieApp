import { prisma } from "@/lib/prisma";
import { getMovieDetails, getTvDetails } from "@/services/tmdb";
import { verifyAuth } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

type ProfileMediaItem = {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  date: string;
  rating: number;
};

// the user fields we send back (used by both GET and PATCH)
const userFields = {
  id: true,
  name: true,
  username: true,
  email: true,
  image: true,
  createdAt: true,
} as const;

// a short way to send an error message
const fail = (message: string, status: number) =>
  NextResponse.json({ message }, { status });

// trim text, or return "" if it is not text
const clean = (value: unknown) => (typeof value === "string" ? value.trim() : "");

// load one movie or show from TMDB (null if it is gone, so the page still loads)
async function getMediaItem(
  tmdbId: number,
  mediaType: "movie" | "tv"
): Promise<ProfileMediaItem | null> {
  try {
    if (mediaType === "movie") {
      const m = await getMovieDetails(tmdbId);
      return { id: m.id, mediaType, title: m.title, posterPath: m.poster_path, date: m.release_date, rating: m.vote_average };
    }

    const s = await getTvDetails(tmdbId);
    return { id: s.id, mediaType, title: s.name, posterPath: s.poster_path, date: s.first_air_date, rating: s.vote_average };
  } catch {
    return null;
  }
}

// turn saved records into full items, skipping the ones that failed
async function loadItems(records: { tmdbId: number; mediaType: "movie" | "tv" }[]) {
  const items = await Promise.all(
    records.map((r) => getMediaItem(r.tmdbId, r.mediaType))
  );
  return items.filter((item): item is ProfileMediaItem => item !== null);
}

export async function GET(req: NextRequest) {
  const { user: tokenUser, error } = verifyAuth(req);
  if (error) return error;

  try {
    const userId = (tokenUser as { id: number }).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...userFields,
        favorites: { orderBy: { createdAt: "desc" }, select: { tmdbId: true, mediaType: true } },
        watchlist: { orderBy: { createdAt: "desc" }, select: { tmdbId: true, mediaType: true } },
      },
    });

    if (!user) return fail("User not found", 404);

    // separate the two lists from the profile fields
    const { favorites, watchlist, ...profile } = user;

    const [favoriteItems, watchlistItems] = await Promise.all([
      loadItems(favorites),
      loadItems(watchlist),
    ]);

    return NextResponse.json({
      user: profile,
      favorites: favoriteItems,
      watchlist: watchlistItems,
    });
  } catch {
    return fail("Unable to load profile", 500);
  }
}

export async function PATCH(req: NextRequest) {
  const { user: tokenUser, error } = verifyAuth(req);
  if (error) return error;

  try {
    const userId = (tokenUser as { id: number }).id;
    const body = await req.json();

    const name = clean(body.name);
    const username = clean(body.username);
    const email = clean(body.email).toLowerCase();
    const image = body?.image; // undefined = keep, null = remove, text = new image

    // check the text fields
    if (!name || !username || !email) {
      return fail("Name, username, and email are required", 400);
    }
    if (name.length > 80 || username.length > 40 || email.length > 254) {
      return fail("One or more profile fields are too long", 400);
    }

    // does someone else already use this email?
    const emailTaken = await prisma.user.findFirst({
      where: { email, NOT: { id: userId } },
      select: { id: true },
    });
    if (emailTaken) return fail("Email is already in use", 409);

    // check the image (only when a new one is sent)
    if (image !== undefined && image !== null) {
      if (typeof image !== "string" || !image.startsWith("data:image/")) {
        return fail("Choose a valid image file", 400);
      }
      if (image.length > 2_800_000) {
        return fail("Profile image must be smaller than 2 MB", 413);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, username, email, ...(image !== undefined && { image }) },
      select: userFields,
    });

    return NextResponse.json({ user: updatedUser });
  } catch {
    return fail("Unable to update profile", 500);
  }
}