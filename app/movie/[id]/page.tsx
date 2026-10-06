import CastSection from "@/components/CastSection";
import CrewSection from "@/components/CrewSection";
import { MoreDetail } from "@/components/Moredetails";
import MovieHero from "@/components/MovieHero";
import RelatedMovies from "@/components/RelatedMoies";
import Trailer from "@/components/Trailer";
import { getMovieCredits, getMovieDetails, getMovieRecommendations, getMovieVideos } from "@/services/tmdb";

export default async function MovieDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    
    const [movie, videos, movieCredits, recommendations] = await Promise.all([
        getMovieDetails(Number(id)),
        getMovieVideos(Number(id)),
        getMovieCredits(Number(id)),
        getMovieRecommendations(Number(id))
    ]);

    const crew = movieCredits?.crew ?? [];

    const directors = crew.filter((p) => p.job === "Director");
    const writers = crew.filter((p) => p.job === "Screenplay" || p.job === "Writer");
    const producers = crew.filter((p) => p.job === "Producer");
    const composers = crew.filter((p) => p.job === "Original Music Composer");

    const keyCrew = [...directors, ...writers, ...producers, ...composers].slice(0, 12);

    return (
        <div>
            <MovieHero movie={movie} videos={videos}/>
            <MoreDetail movie={movie} />
            <Trailer videos={videos} movie={movie} />
            <CastSection cast={movieCredits?.cast} id={movie.id} basePath="movie" />
            <CrewSection crew={keyCrew} id={movie.id} basePath="movie" />
            <RelatedMovies movies={recommendations ?? []} basePath="movie" />
        </div>
    );
}