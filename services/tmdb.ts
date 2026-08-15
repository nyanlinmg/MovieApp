import { MovieType, TvType } from "@/types/global";

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = process.env.TMDB_ACCESS_TOKEN;

// TMDB always returns data in this shape: { results: [...] }
// so we just type the "results" part we care about.

export async function getTrendingMovies() {
  const res = await fetch(`${BASE_URL}/trending/movie/week`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  const data = await res.json();

  if (!res.ok) {
    console.log("TMDB error:", res.status, data);
    throw new Error(`TMDB request failed: ${res.status}`);
  }

  return data.results as MovieType[];
}

export async function getTrendingTv() {
  const res = await fetch(`${BASE_URL}/trending/tv/week`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const data = await res.json();
  return data.results as TvType[];
}

export async function getPopularMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const data = await res.json();
  return data.results as MovieType[];
}

export async function getPopularTv() {
  const res = await fetch(`${BASE_URL}/tv/popular`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const data = await res.json();
  return data.results as TvType[];
}

export async function getUpcomingMovies() {
  const res = await fetch(`${BASE_URL}/movie/upcoming`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
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
  const data = await res.json();
  return data.results as TvType[];
}