import { MoreDetail } from "@/components/Moredetails";
import MovieHero from "@/components/MovieHero";
import { getMovieCertification, getMovieDetails } from "@/services/tmdb";

export default async function MovieDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const movie = await getMovieDetails(Number(id));

    return (
        <div>
            <MovieHero movie={movie}/>

            <MoreDetail movie={movie} />
        </div>
    );
}