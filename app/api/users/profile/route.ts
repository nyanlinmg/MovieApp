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

async function getProfileMediaItem(
  tmdbId: number,
  mediaType: "movie" | "tv"
): Promise<ProfileMediaItem | null> {
  try {
    if (mediaType === "movie") {
      const movie = await getMovieDetails(tmdbId);

      return {
        id: movie.id,
        mediaType,
        title: movie.title,
        posterPath: movie.poster_path,
        date: movie.release_date,
        rating: movie.vote_average,
      };
    }

    const show = await getTvDetails(tmdbId);

    return {
      id: show.id,
      mediaType,
      title: show.name,
      posterPath: show.poster_path,
      date: show.first_air_date,
      rating: show.vote_average,
    };
  } catch {
    // A removed or unavailable TMDB title should not prevent the rest of the page loading.
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { user: tokenUser, error } = verifyAuth(req);

  if (error) return error;

  try {
    const { id: userId } = tokenUser as { id: number };
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        createdAt: true,
        favorites: {
          orderBy: { createdAt: "desc" },
          select: { tmdbId: true, mediaType: true },
        },
        watchlist: {
          orderBy: { createdAt: "desc" },
          select: { tmdbId: true, mediaType: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const loadCollection = async (
      records: typeof user.favorites
    ): Promise<ProfileMediaItem[]> => {
      const items = await Promise.all(
        records.map(({ tmdbId, mediaType }) =>
          getProfileMediaItem(tmdbId, mediaType)
        )
      );

      return items.filter(
        (item): item is ProfileMediaItem => item !== null
      );
    };

    const [favorites, watchlist] = await Promise.all([
      loadCollection(user.favorites),
      loadCollection(user.watchlist),
    ]);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
      },
      favorites,
      watchlist,
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to load profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { user: tokenUser, error } = verifyAuth(req);

  if (error) return error;

  try {
    const { id: userId } = tokenUser as { id: number };
    const body = (await req.json()) as {
      name?: unknown;
      username?: unknown;
      email?: unknown;
      image?: unknown;
    };

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!name || !username || !email) {
      return NextResponse.json(
        { message: "Name, username, and email are required" },
        { status: 400 }
      );
    }

    if (name.length > 80 || username.length > 40 || email.length > 254) {
      return NextResponse.json(
        { message: "One or more profile fields are too long" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Enter a valid email address" },
        { status: 400 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const emailOwner = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (emailOwner && emailOwner.id !== userId) {
      return NextResponse.json(
        { message: "Email is already in use" },
        { status: 409 }
      );
    }

    if (body.image !== undefined) {
      if (
        body.image !== null &&
        (typeof body.image !== "string" || !body.image.startsWith("data:image/"))
      ) {
        return NextResponse.json(
          { message: "Choose a valid image file" },
          { status: 400 }
        );
      }

      if (typeof body.image === "string" && body.image.length > 2_800_000) {
        return NextResponse.json(
          { message: "Profile image must be smaller than 2 MB" },
          { status: 413 }
        );
      }
    }

    const updateData: {
      name: string;
      username: string;
      email: string;
      image?: string | null;
    } = { name, username, email };

    if (body.image !== undefined) {
      updateData.image = body.image as string | null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch {
    return NextResponse.json(
      { message: "Unable to update profile" },
      { status: 500 }
    );
  }
}
