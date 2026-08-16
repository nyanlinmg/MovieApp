import { MovieType, TvType } from "@/types/global";

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = process.env.TMDB_ACCESS_TOKEN;

export async function getTrendingMovies() {
  const res = await fetch(`${BASE_URL}/trending/movie/week`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`TMDB request failed`);
  }

  return data.results as MovieType[];
}

export async function getTrendingTv() {
  const res = await fetch(`${BASE_URL}/trending/tv/week`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if(!res.ok) {
    throw new Error("Failed to fetch data.");
  }

  const data = await res.json();
  return data.results as TvType[];
}

export async function getPopularMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if(!res.ok) {
    throw new Error("Failed to fetch data.");
  }

  const data = await res.json();
  return data.results as MovieType[];
}

export async function getPopularTv() {
  const res = await fetch(`${BASE_URL}/tv/popular`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if(!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data.results as TvType[];
}

export async function getUpcomingMovies() {
  const res = await fetch(`${BASE_URL}/movie/upcoming`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if(!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data.results as MovieType[];
}

export async function getUpcomingTv() {
  // TMDB has no "upcoming" endpoint for TV shows, so we use discover
  // and ask for shows that start airing today or later.
  const today = new Date().toISOString().split("T")[0];
  const res = await fetch(
    `${BASE_URL}/discover/tv?first_air_date.gte=${today}&sort_by=first_air_date.asc`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );

  if(!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data.results as TvType[];
}

export async function getMovieDetails(id: number): Promise<MovieType> {
    const res = await fetch(`${BASE_URL}/movie/${id}?language=en-US`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        accept: "application/json"
      }
    });

    if(!res.ok) {
      throw new Error("Failed to fetch movie details");
    }

    const data = await res.json();

    return data;
}

export async function getMovieCertification(id: number) : Promise<string | null> {
    const res = await fetch(`${BASE_URL}/movie/${id}/release_date`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        accept: "application/json"
      }
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const us = data.results.find((r: { iso_3166_1: string }) => r.iso_3166_1 === "US");
    return us?.release_date[0]?.certification || null;
}