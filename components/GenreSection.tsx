"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Genre } from "@/types/global";

export default function GenreSection({ genres }: { genres: Genre[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="mx-10 px-6 py-8"
    >
      <h2 className="mb-4 text-2xl font-bold text-white">Browse by Genre</h2>

      <div className="flex flex-wrap gap-3">
        {genres.map((genre, index) => (
          <motion.div
            key={genre.id}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
          >
            <Link
              href={`/movie/popular?genres=${genre.id}`}
              className="inline-block rounded-full border border-gray-700 bg-[#111827] px-4 py-2 text-sm text-white transition-colors hover:border-[#01b4e4] hover:text-[#01b4e4]"
            >
              {genre.name}
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
