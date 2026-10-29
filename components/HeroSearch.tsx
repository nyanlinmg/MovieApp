"use client";

import { motion } from "framer-motion";
import SearchBox from "@/components/SearchBox";
import Link from "next/link";
import type { MovieType } from "@/types/global";

export default function HeroSearch({
  backdropUrl,
  featuredMovie,
}: {
  backdropUrl: string;
  featuredMovie?: MovieType;
}) {
  return (
    <div
      className="flex min-h-105 w-full items-center bg-cover bg-center px-6 py-12 text-left md:px-16"
      style={{
        backgroundImage: `linear-gradient(rgba(3,37,65,0.75), rgba(3,37,65,0.92)), url(${backdropUrl})`,
      }}
    >
      <motion.div
        className="mx-auto w-full max-w-6xl text-white"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-300">
          Featured movie
        </p>

        <h1 className="mb-3 max-w-3xl text-4xl font-bold md:text-5xl">
          {featuredMovie?.title ?? "Welcome."}
        </h1>

        {featuredMovie && (
          <div className="mb-4 flex flex-wrap gap-4 text-sm text-white/80">
            {featuredMovie.release_date && (
              <span>{featuredMovie.release_date.slice(0, 4)}</span>
            )}
            <span>★ {featuredMovie.vote_average.toFixed(1)} / 10</span>
          </div>
        )}

        <p className="mb-6 max-w-2xl line-clamp-3 text-white/80">
          {featuredMovie?.overview || "Millions of movies and TV shows to discover. Explore now."}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {featuredMovie && (
            <Link
              href={`/movie/${featuredMovie.id}`}
              className="w-fit rounded-md bg-[#01b4e4] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#01b4e4]/80"
            >
              View Details
            </Link>
          )}

          <SearchBox className="max-w-xl" />
        </div>
      </motion.div>
    </div>
  );
}
