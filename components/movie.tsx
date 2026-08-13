import { MovieType } from "@/types/global";
import Link from "next/link";

const poster = "http://image.tmdb.org/t/p/w185";

export default function Movie({movie} : {movie: MovieType}) {
    return (
        <div className="w-42 text-center mb-2">
            <Link href={`/movie/${movie.id}`}>
                <img 
                    src={poster + movie.poster_path} 
                    alt=""
                    className="hover:scale-105 cursor-pointer transition-all" />
            </Link>
            <b>{movie.title}</b>
            <div>{movie.release_date}</div>
        </div>
    )
}