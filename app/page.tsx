import HeroSearch from "@/components/HeroSearch";
import FilterableMovieSection from "@/components/FilterableMovieSection";
import {
  getGenres,
  getLatestTrailers,
  getPopularMovies,
  getPopularTv,
  getTrendingMovies,
  getTrendingTv,
  getUpcomingMovies,
  getUpcomingTv,
} from "@/services/tmdb";
import LatestTrailers from "@/components/LatestTrailers";
import GenreSection from "@/components/GenreSection";
import WatchlistSection from "@/components/WatchlistSection";

const BACKDROP_BASE = "http://image.tmdb.org/t/p/original";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    trendingMovies,
    trendingTv,
    popularMovies,
    popularTv,
    upcomingMovies,
    upcomingTv,
    latestTrailers,
    movieGenres,
  ] = await Promise.all([
    getTrendingMovies(),
    getTrendingTv(),
    getPopularMovies(),
    getPopularTv(),
    getUpcomingMovies(),
    getUpcomingTv(),
    getLatestTrailers(),
    getGenres("movie"),
  ]);

  const withBackdrop = trendingMovies.filter((m) => m.backdrop_path);
  const randomIndex = Math.floor(Math.random() * withBackdrop.length);
  const randomMovie = withBackdrop[randomIndex];
  const backdropUrl = randomMovie ? BACKDROP_BASE + randomMovie.backdrop_path : "";

  return (
    <div className="bg-black min-h-screen">
      <HeroSearch backdropUrl={backdropUrl} featuredMovie={randomMovie} />

      <FilterableMovieSection
        title="Trending"
        movieItems={trendingMovies}
        tvItems={trendingTv}
        movieViewAllHref="/movie/trending"
        tvViewAllHref="/tv/trending"
      />

      <GenreSection genres={movieGenres} />
      <WatchlistSection />

      <LatestTrailers trailers={latestTrailers} />

      <FilterableMovieSection
        title="Popular"
        movieItems={popularMovies}
        tvItems={popularTv}
        movieViewAllHref="/movie/popular"
        tvViewAllHref="/tv/popular"
      />

      <FilterableMovieSection
        title="Upcoming"
        movieItems={upcomingMovies}
        tvItems={upcomingTv}
        movieViewAllHref="/movie/upcoming"
        tvViewAllHref="/tv/upcoming"
      />
    </div>
  );
}
