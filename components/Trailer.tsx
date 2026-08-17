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
        <div className="px-14 py-8 text-4xl">
            <h1 className="flex items-center gap-3 font-bold mb-4">Trailer <Video size="40"/> </h1>

            <div className="flex gap-4 border-2 justify-center items-center py-5 rounded-2xl shadow-2xl border-mist-700">
                {trailer ? (
                    <div className="lg:w-180 lg:h-100 md:h-100 h-80 shrink-0">
                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            className="w-full h-full"
                            title="trailer"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <p className="text-[18px] text-gray-400">Trailer is not available</p>
                )}

                <div className="lg:w-200 lg:h-100 md:h-100 border-mist-300 h-80 shrink-0">
                    <img src={`${image_url}${movie?.backdrop_path}`} className="w-full h-full"/>
                </div>
            </div>
        </div>
    )
}