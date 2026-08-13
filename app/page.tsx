import Movie from "@/components/movie";
import { MovieType } from "@/types/global";

async function fetchUpcoming(): Promise<MovieType[]> {
    const res = await fetch("https://api.themoviedb.org/3/movie/upcoming", {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        }
    });

    const data = await res.json();
    return data.results;
}

async function fetchPopular(): Promise<MovieType[]> {
    const res = await fetch("https://api.themoviedb.org/3/movie/popular", {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        }
    });

    const data = await res.json();
    return data.results;
}

export default async function Home() {
    const upcoming = await fetchUpcoming();
    const popular = await fetchPopular();

    return (
        <div>
            <h2 className="text-2xl p-2 mb-4 border-b">Popular</h2>
            <div className="flex flex-wrap gap-2">
                {popular.map(movie => {
                    return (
                      <Movie key={movie.id} movie={movie} />
                    )
                })}
            </div>

            <h2 className="text-2xl p-2 mb-4 border-b mt-3">Upcoming</h2>
            <div className="flex flex-wrap gap-2">
                {upcoming.map(movie => {
                    return (
                      <Movie key={movie.id} movie={movie} />
                    )
                })}
            </div>
        </div>
    )
}