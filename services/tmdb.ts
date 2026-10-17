import { CompanyDetails, CreditsType, MovieType, StudioContentItem, TvType, VideoType, PersonDetails, Genre, SearchSuggestion } from "@/types/global";

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = process.env.TMDB_ACCESS_TOKEN;

export type DiscoverFilters = {
  sortBy?: string;
  genres?: string;
  minRating?: string;
  yearFrom?: string;
  yearTo?: string;
  page?: number;
  extra?: Record<string, string>
};

type MovieSearchItem = {
  id: number;
  title?: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
};

type TvSearchItem = {
  id: number;
  name?: string;
  poster_path: string | null;
  first_air_date?: string;
  vote_average?: number;
};

type AwardBinding = {
  awardLabel: { value: string };
  date?: { value: string };
};

function getYear(date?: string) {
  return date ? date.slice(0, 4) : "N/A";
}

function createSearchParams(query: string, page = 1) {
  return new URLSearchParams({
    query,
    include_adult: "false",
    language: "en-US",
    page: String(page),
  });
}

function toMovieItem(movie: MovieSearchItem): StudioContentItem {
  return {
    id: movie.id,
    title: movie.title || "Untitled",
    poster_path: movie.poster_path,
    release_date: movie.release_date || "",
    vote_average: movie.vote_average ?? 0,
  };
}

function toTvItem(show: TvSearchItem): StudioContentItem {
  return {
    id: show.id,
    name: show.name || "Untitled",
    poster_path: show.poster_path,
    first_air_date: show.first_air_date || "",
    vote_average: show.vote_average ?? 0,
  };
}

async function fetchMovieSearch(query: string, page = 1) {
  const params = createSearchParams(query, page);

  const res = await fetch(`${BASE_URL}/search/movie?${params.toString()}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movie search results");
  }

  const data = await res.json();
  return data.results as MovieSearchItem[];
}

async function fetchTvSearch(query: string, page = 1) {
  const params = createSearchParams(query, page);

  const res = await fetch(`${BASE_URL}/search/tv?${params.toString()}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tv search results");
  }

  const data = await res.json();
  return data.results as TvSearchItem[];
}

export async function getDiscover(
  type: "movie" | "tv",
  filters: DiscoverFilters = {}
): Promise<{ results: StudioContentItem[]; total_pages: number; total_results: number}> {

  const dateField = type === "movie" ? "primary_release_date" : "first_air_date";

  const sortBy = (filters.sortBy || "popularity.desc").replace(/^date\./, `${dateField}.`);

  const params = new URLSearchParams({
    language: "en-US",
    sort_by: sortBy,
    page: String(filters.page || 1)
  });

  if(filters.extra) {
    for(const key in filters.extra) {
      params.set(key, filters.extra[key]);
    }
  }

  if (filters.genres) params.set("with_genres", filters.genres);
  if (filters.minRating) params.set("vote_average.gte", filters.minRating);
  if (filters.yearFrom) params.set(`${dateField}.gte`, `${filters.yearFrom}-01-01`);
  if (filters.yearTo) params.set(`${dateField}.lte`, `${filters.yearTo}-12-31`);

  if(sortBy.startsWith("vote_average")) params.set("vote_count.gte", "200");

  const res = await fetch(`${BASE_URL}/discover/${type}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch discover list");
  }

  const data = await res.json();
  return {
    results: data.results,
    total_pages: Math.min(data.total_pages, 500),
    total_results: data.total_results,
  };
}

export async function getGenres(type: "movie" | "tv"): Promise<Genre[]> {
  const res = await fetch(`${BASE_URL}/genre/${type}/list?language=en`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch genres");
  }

  const data = await res.json();
  return data.genres;
}

export async function getSearchResults(query: string): Promise<{
  movies: StudioContentItem[];
  tvShows: StudioContentItem[];
}> {
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    return { movies: [], tvShows: [] };
  }

  const [movieResults, tvResults] = await Promise.all([
    fetchMovieSearch(cleanQuery),
    fetchTvSearch(cleanQuery),
  ]);

  return {
    movies: movieResults.map(toMovieItem),
    tvShows: tvResults.map(toTvItem),
  };
}

export async function getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
  const cleanQuery = query.trim().toLowerCase();

  if (!cleanQuery) return [];

  const pages = cleanQuery.length <= 2 ? [1, 2, 3] : [1];
  const [moviePages, tvPages] = await Promise.all([
    Promise.all(pages.map((page) => fetchMovieSearch(query, page))),
    Promise.all(pages.map((page) => fetchTvSearch(query, page))),
  ]);

  const movies = moviePages.flat().map(toMovieItem);
  const tvShows = tvPages.flat().map(toTvItem);

  const movieSuggestions = movies
    .map((movie) => ({
      id: movie.id,
      title: movie.title || "Untitled",
      mediaType: "movie" as const,
      poster_path: movie.poster_path,
      year: getYear(movie.release_date),
    }))
    .filter((movie) => movie.title.toLowerCase().startsWith(cleanQuery));

  const tvSuggestions = tvShows
    .map((show) => ({
      id: show.id,
      title: show.name || "Untitled",
      mediaType: "tv" as const,
      poster_path: show.poster_path,
      year: getYear(show.first_air_date),
    }))
    .filter((show) => show.title.toLowerCase().startsWith(cleanQuery));

  return [...movieSuggestions, ...tvSuggestions].slice(0, 10);
}

export async function getPersonAwards(imdbId: string | null) {
  if(!imdbId) return [];

  const query = `
    SELECT ?awardLabel ?date WHERE {
      ?person wdt:P345 "${imdbId}".
      ?person p:P166 ?statement.
      ?statement ps:P166 ?award.
      OPTIONAL { ?statement pq:P585 ?date. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
  `;

  try{
    const res = await fetch(
      `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`,
      { headers: { "User-Agent": "MovieHub/1.0 (student project)" } }
    );

    if(!res.ok) return [];

    const data = await res.json();

    return data.results.bindings.map((item: AwardBinding) => ({
      name: item.awardLabel.value,
      year: item.date ? item.date.value.slice(0, 4) : "",
    }));
  }catch {
    return [];
  }
}

export async function getPersonCredits(id: number) {
  const res = await fetch(`${BASE_URL}/person/${id}/combined_credits?language=en-US`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch person credits");
  }

  const data = await res.json();
  return data.cast;
}

export async function getPersonImages(id: number) {
  const res = await fetch(`${BASE_URL}/person/${id}/images`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch person images");
  }

  const data = await res.json();
  return data.profiles;
}

export async function getLatestTrailers() {
  const movies = await getPopularMovies();
  const trailers = [];

  for(const movie of movies.slice(0, 12)) {
    const videos = await getMovieVideos(movie.id);
    const trailer = videos.find(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    );

    if(trailer) {
      trailers.push({
        id: movie.id,
        title: movie.title,
        image: movie.backdrop_path,
        videoKey: trailer.key,
        videoName: trailer.name
      })
    }
  }

  return trailers;
}

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

export async function getCompanyDetails(companyId: number): Promise<CompanyDetails> {
  const res = await fetch(`${BASE_URL}/company/${companyId}`, {
    headers: {Authorization: `Bearer ${TOKEN}`}
  });

  if(!res.ok) {
    throw new Error("Failed to fetch company details");
  }

  const data = await res.json();
  return data;
}

export async function getCompanyMovies(companyId: number, page = 1, sortBy = "popularity.desc") : Promise<{results: StudioContentItem[]; total_pages: number; total_results: number}> {
  const res = await fetch(`${BASE_URL}/discover/movie?with_companies=${companyId}&sort_by=${sortBy}&page=${page}`, {
    headers: {Authorization: `Bearer ${TOKEN}`}
  });

  if(!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await res.json();
  return data;
}

export async function getCompanyTVShows(companyId: number, page = 1, sortBy = "popularity.desc") : Promise<{results: StudioContentItem[]; total_pages: number; total_results: number}> {
  const res = await fetch(`${BASE_URL}/discover/tv?with_companies=${companyId}&sort_by=${sortBy}&page=${page}`, {
    headers: {Authorization: `Bearer ${TOKEN}`}
  });

  if(!res.ok) {
    throw new Error("Failed to fetch tv shows");
  }

  const data = await res.json();
  return data;
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

export async function getPerson(id: number) : Promise<PersonDetails> {
  const res = await fetch(
    `${BASE_URL}/person/${id}?language=en-US&append_to_response=combined_credits,external_ids`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        accept: "application/json"
      }
    }
  );

  if(!res.ok) {
    throw new Error("Failed to fetch person details");
  }

  return res.json();
}

export async function getPopularPeople(page = 1) {
  const res = await fetch(
    `${BASE_URL}/person/popular?language=en-US&page=${page}`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch popular people");
  }

  const data = await res.json();

  return {
    results: data.results as {
      id: number;
      name: string;
      known_for_department: string;
      profile_path: string | null;
    }[],
    total_pages: Math.min(data.total_pages, 100),
  };
}
