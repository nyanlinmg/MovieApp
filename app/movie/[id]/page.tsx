import { MoreDetail } from "@/components/Moredetails";
import MovieHero from "@/components/MovieHero";
import Trailer from "@/components/Trailer";
import { getMovieDetails, getMovieVideos } from "@/services/tmdb";

export default async function MovieDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    
    const [movie, videos] = await Promise.all([
        getMovieDetails(Number(id)),
        getMovieVideos(Number(id))
    ]);

    return (
        <div>
            <MovieHero movie={movie}/>
            <MoreDetail movie={movie} />
            <Trailer videos={videos} movie={movie} />
        </div>
    );
}