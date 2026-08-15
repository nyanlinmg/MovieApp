"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HeroSearch({ backdropUrl }: { backdropUrl: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim() !== "") {
      router.push(`/search?q=${query}`);
    }
  }

  return (
    <div
      className="w-full h-105 flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(3,37,65,0.75), rgba(3,37,65,0.92)), url(${backdropUrl})`,
      }}
    >
      {/* One motion.div wraps everything - it all fades + slides in together */}
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

        <form onSubmit={handleSearch} className="flex w-full max-w-xl gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a movie, tv show..."
            className="bg-white text-black h-12"
          />
          <Button
            type="submit"
            className="h-12 px-6 bg-[#01b4e4] hover:bg-[#01b4e4]/80 cursor-pointer"
          >
            <Search size={18} />
          </Button>
        </form>
      </motion.div>
    </div>
  );
}