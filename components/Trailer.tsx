"use client";

import { useState } from "react";
import { Heart as HeartIcon, Video } from "lucide-react";
import { MovieType } from "@/types/global";

type TrailerVideo = {
    key: string;
    site: string;
    type: string;
    official: boolean;
};
const image_url = "http://image.tmdb.org/t/p/w1280";

export default function Trailer({ videos, movie }: { videos: TrailerVideo[]; movie: MovieType }) {

    const trailer = videos?.find((v) => v.site === "YouTube" && v.type === "Trailer");

    return (
        <div className="px-10 py-8 text-4xl">
            <h1 className="flex items-center gap-3 font-bold mb-4">Trailer <Video size="40"/> </h1>

            {trailer ? (
                <div className="lg:flex gap-4 border-2 justify-center items-center py-5 rounded-2xl shadow-2xl border-mist-700">
                    <div className="lg:w-100 xl:w-160 lg:h-100 md:h-100 h-80 shrink-0">
                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            className="w-full h-full"
                            title="trailer"
                            allowFullScreen
                        />
                    </div>

                    <div className="lg:w-100 xl:w-200 xl:h-100 lg:h-80 md:h-100 border-mist-300 h-80 shrink-0">
                        <img src={`${image_url}${movie?.backdrop_path}`} className="w-full h-full" />
                    </div>
                </div>
            ) : (
                <div className="relative h-80 md:h-100 xl:h-125 overflow-hidden rounded-2xl border-2 border-mist-700 shadow-2xl bg-black">
                    {movie?.backdrop_path && (
                        <img
                            src={`${image_url}${movie.backdrop_path}`}
                            alt={movie.title}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    )}

                    <div className="absolute inset-0 bg-black/60" />

                    <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 text-white">
                        <Video size={48} className="opacity-80" />
                        <p className="text-[18px]">Trailer is not available</p>
                    </div>
                </div>
            )}
        </div>
    )
} 