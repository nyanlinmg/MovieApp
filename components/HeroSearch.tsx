"use client";

import { motion } from "framer-motion";
import SearchBox from "@/components/SearchBox";

export default function HeroSearch({ backdropUrl }: { backdropUrl: string }) {
  return (
    <div
      className="w-full h-105 flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(3,37,65,0.75), rgba(3,37,65,0.92)), url(${backdropUrl})`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Welcome.
        </h1>

        <p className="text-white/80 mb-8 max-w-lg">
          Millions of movies, TV shows, and anime to discover. Explore now.
        </p>

        <SearchBox className="max-w-xl" />
      </motion.div>
    </div>
  );
}
