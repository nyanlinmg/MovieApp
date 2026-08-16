"use client";

import { MovieType } from "@/types/global";
import { easeInOut, motion } from "framer-motion";
import { ScoreCircle } from "./ScoreCircle";

const image_url = "http://image.tmdb.org/t/p/w1280";
const poster_url = "http://image.tmdb.org/t/p/w500";

export default function MovieHero({ movie}: { movie: MovieType}) {
    const releaseDate = new Date(movie.release_date).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
    });

    const hours = Math.floor(movie.runtime / 60);
    const minutes = movie.runtime % 60;
    const score = Math.round(movie.vote_average * 10);

    return (
        <div>
            <div className="relative text-white">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${image_url}${movie.backdrop_path})` }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-0 bg-linear-to-t from-[#0d1b2a] via-[#0d1b2a]/60 to-transparent" />
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{duration: 0.5, ease: "easeInOut", type: "spring", stiffness: 300, damping: 10}}
                    className="relative z-10 flex flex-col gap-8 px-8 py-16 md:flex-row md:px-16"
                >
                    {/* Poster */}
                    <div className="w-60 shrink-0 overflow-hidden rounded-lg shadow-xl md:w-70 h-90 md:h-100">
                        <img
                            src={`${poster_url}${movie.poster_path}`}
                            alt={movie.title}
                            className="h-full w-full"
                        />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-4 pt-4">
                        <h1 className="text-3xl font-bold md:text-4xl">
                            {movie.title}{" "}
                            <span className="font-normal text-gray-300">
                                ({new Date(movie.release_date).getFullYear()})
                            </span>
                        </h1>

                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-300">
                            <span>{releaseDate}</span>
                            <span>•</span>
                            <span>{movie.genres?.map((g) => g.name).join(" , ")}</span>
                            <span>•</span>
                            <span>{hours}h {minutes}m</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <ScoreCircle score={score} />
                            <span className="font-medium">User Score</span>
                        </div>

                        {movie.tagline && (
                            <p className="italic text-gray-300">{movie.tagline}</p>
                        )}

                        <div>
                            <h2 className="mb-2 text-xl font-semibold">Overview</h2>
                            <p className="leading-relaxed text-gray-200">{movie.overview}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}