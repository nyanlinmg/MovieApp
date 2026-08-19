import CastSection from "@/components/CastSection";
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

    return (
        <div>
            <MovieHero movie={movie}/>
            <MoreDetail movie={movie} />
            <Trailer videos={videos} movie={movie} />
            <CastSection cast={movieCredits?.cast} id={movie.id} basePath="movie" />
            <RelatedMovies movies={recommendations ?? []} basePath="movie" />
        </div>
    );
}