import Movie from "@/components/movie";
import { MovieType } from "@/types/global";

async function fetchGenre(id: string): Promise<MovieType[]> {
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${id}`, {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        }
    });

    const data = await res.json();
    return data.results;
}

export default async function Genre({
    params,
}: {
    params: Promise<{id: string, name: string}>
}) {
    const {id, name} = await params;
    const genre = await fetchGenre(id);

    return (
        <div>
            <h2 className="text-2xl p-2 mb-4 border-b">Popular</h2>
            <div className="flex flex-wrap gap-2">
                {genre.map(movie => {
                    return (
                      <Movie key={movie.id} movie={movie} />
                    )
                })}
            </div>
        </div>
    )
}