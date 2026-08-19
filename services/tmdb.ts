import { CreditsType, MovieType, TvType, VideoType } from "@/types/global";

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

export async function getMovieVideos(id: number) : Promise<VideoType[]> {
  const res = await fetch(`${BASE_URL}/movie/${id}/videos?language=en-US`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movie videos");
  }

  const data = await res.json();
  return data.results;
}

export async function getMovieCredits(id: number): Promise<CreditsType> {
  const res = await fetch(`${BASE_URL}/movie/${id}/credits?language=en-US`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movie credits");
  }

  const data = await res.json();
  return data;
}

export async function getMovieRecommendations(id: number): Promise<MovieType[]> {
  const res = await fetch(`${BASE_URL}/movie/${id}/recommendations?language=en-US`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movie recommendations");
  }

  const data = await res.json();
  return data.results;
}

export async function getTvDetails(id: number): Promise<TvType> {
  const res = await fetch(`${BASE_URL}/tv/${id}?language=en-US`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tv details");
  }

  return res.json();
}

export async function getTvVideos(id: number): Promise<VideoType[]> {
  const res = await fetch(`${BASE_URL}/tv/${id}/videos?language=en-US`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tv videos");
  }

  const data = await res.json();
  return data.results;
}

export async function getTvCredits(id: number): Promise<CreditsType> {
  const res = await fetch(`${BASE_URL}/tv/${id}/credits?language=en-US`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tv credits");
  }

  return res.json();
}

export async function getTvRecommendations(id: number): Promise<TvType[]> {
  const res = await fetch(`${BASE_URL}/tv/${id}/recommendations?language=en-US`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tv recommendations");
  }

  const data = await res.json();
  return data.results as TvType[];
}