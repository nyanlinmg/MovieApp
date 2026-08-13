import { MovieType, PersonType } from "@/types/global";
import Link from "next/link";

async function  fetchMovie(id: string): Promise<MovieType> {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        }
    });

    return await res.json();
}

async function  fetchCasts(id: string): Promise<PersonType[]> {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits`, {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        }
    });

    return (await res.json()).cast;
}

const image_url = "http://image.tmdb.org/t/p/w1280";
const person_url = "http://image.tmdb.org/t/p/w185";

export default async function MovieDetail({
    params,
}: {
    params: Promise<{id: string}>
}) {
    const {id} = await params;
    const movie = await fetchMovie(id);
    const casts = await fetchCasts(id);

    return <div>
        <h2 className="text-2xl font-bold border-b mb-4 py-3">
            {movie.title} ({movie.release_date.split("-")[0]})
        </h2>
        <img src={image_url + movie.backdrop_path} alt="" />
        <p className="mt-2 mb-6">{movie.overview}</p>

        <h3 className="border-b pb-2 font-bold text-2xl mb-4">Casts</h3>
        <div className="flex flex-wrap gap-2">
            {casts.map(cast => {
                return (
                    <div 
                        key={cast.id}
                        className="w-40 text-center"
                    >
                        <Link href={`/person/${cast.id}`}>
                            {cast.profile_path ? (
                                <img src={person_url + cast.profile_path} alt="" />
                            ) : (
                                <div className="bg-gray-200 h-60"></div>
                            )}
                        </Link>
                        <div className="mt-2">{cast.name}</div>
                        <span className="text-gray-600">
                            {cast.character}
                        </span>
                    </div>
                )
            })}
        </div>
    </div>
}