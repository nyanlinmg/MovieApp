import HeroSearch from "@/components/HeroSearch";
import FilterableMovieSection from "@/components/FilterableMovieSection";
import {
  getLatestTrailers,
  getPopularMovies,
  getPopularTv,
  getTrendingMovies,
  getTrendingTv,
  getUpcomingMovies,
  getUpcomingTv,
} from "@/services/tmdb";
import LatestTrailers from "@/components/LatestTrailers";

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
  ] = await Promise.all([
    getTrendingMovies(),
    getTrendingTv(),
    getPopularMovies(),
    getPopularTv(),
    getUpcomingMovies(),
    getUpcomingTv(),
    getLatestTrailers()
  ]);

  const withBackdrop = trendingMovies.filter((m) => m.backdrop_path);
  const randomIndex = Math.floor(Math.random() * withBackdrop.length);
  const randomMovie = withBackdrop[randomIndex];
  const backdropUrl = randomMovie ? BACKDROP_BASE + randomMovie.backdrop_path : "";

  return (
    <div className="bg-black min-h-screen">
      <HeroSearch backdropUrl={backdropUrl} />

      <FilterableMovieSection
        title="Trending"
        movieItems={trendingMovies}
        tvItems={trendingTv}
        movieViewAllHref="/movie/trending"
        tvViewAllHref="/tv/trending"
      />

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