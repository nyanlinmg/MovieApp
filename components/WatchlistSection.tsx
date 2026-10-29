"use client";

import { useApp } from "@/Provider/AppProvider";
import { useGetProfileData } from "@/hooks/userhook";
import ProfileMediaCard from "@/components/ProfileMediaCard";
import Link from "next/link";
import { motion } from "framer-motion";

function SignedInWatchlist() {
  const { data, isLoading, isError } = useGetProfileData();

  if (isLoading || isError || !data) return null;

  const watchlist = data.watchlist.slice(0, 6);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="mx-10 px-6 py-8"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Your Watchlist</h2>
        <Link
          href="/profile"
          className="text-sm text-[#01b4e4] hover:text-[#01b4e4]/80"
        >
          View All
        </Link>
      </div>

      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {watchlist.map((item, index) => (
            <motion.div
              key={`${item.mediaType}-${item.id}`}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <ProfileMediaCard item={item} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/3 px-5 py-8 text-center">
          <p className="text-white/65">Your watchlist is empty.</p>
          <Link
            href="/movie/popular"
            className="mt-2 inline-block text-sm text-[#01b4e4] hover:underline"
          >
            Browse movies
          </Link>
        </div>
      )}
    </motion.section>
  );
}

export default function WatchlistSection() {
  const { auth, authLoading } = useApp();

  if (authLoading || !auth) return null;

  return <SignedInWatchlist />;
}
