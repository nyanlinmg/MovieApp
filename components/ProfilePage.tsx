"use client";

import { useApp } from "@/Provider/AppProvider";
import ProfileEditDialog from "@/components/ProfileEditDialog";
import ProfileMediaCard from "@/components/ProfileMediaCard";
import type { ProfileMediaItem } from "@/services/userServices";
import {
  Bookmark,
  CalendarDays,
  Heart,
  LoaderCircle,
  Mail,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetProfileData } from "@/hooks/userhook";
import { motion } from "framer-motion";

function MediaSection({
  title,
  mediaType,
  items,
}: {
  title: string;
  mediaType: "movie" | "tv";
  items: ProfileMediaItem[];
}) {
  const mediaItems = items.filter((item) => item.mediaType === mediaType);
  const browseHref = mediaType === "movie" ? "/movie/popular" : "/tv/popular";

  return (
    <section className="mt-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <span className="text-sm text-white/50">{mediaItems.length}</span>
      </div>

      {mediaItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {mediaItems.map((item, index) => (
            <motion.div
              key={`${item.mediaType}-${item.id}`}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              viewport={{ amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <ProfileMediaCard item={item} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/3 px-5 py-8 text-center">
          <p className="text-white/65">Nothing here yet.</p>
          <Link
            href={browseHref}
            className="mt-2 inline-block text-sm text-[#01b4e4] hover:underline"
          >
            Browse {mediaType === "movie" ? "movies" : "TV shows"}
          </Link>
        </div>
      )}
    </section>
  );
}

function CollectionGroup({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.15 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/10 bg-white/3 p-5 sm:p-7"
    >
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/55">{description}</p>
      </div>
      {children}
    </motion.section>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function ProfilePage() {
  const { auth, authLoading } = useApp();
  const router = useRouter();
  const { data, isLoading, isError } = useGetProfileData();

  useEffect(() => {
    if (!authLoading && !auth) router.replace("/login");
  }, [auth, authLoading, router]);

  if (authLoading || (!auth && !authLoading) || (auth && isLoading)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center gap-3 text-white/70">
        <LoaderCircle className="animate-spin text-[#01b4e4]" />
        <span>{auth ? "Loading your profile..." : "Opening sign in..."}</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-semibold">We couldn't load your profile</h1>
        <p className="mt-2 text-white/60">Please try again in a moment.</p>
      </div>
    );
  }

  const memberSince = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date(data.user.createdAt));

  const movieFavorites = data.favorites.filter((item) => item.mediaType === "movie").length;
  const tvFavorites = data.favorites.filter((item) => item.mediaType === "tv").length;
  const movieWatchlist = data.watchlist.filter((item) => item.mediaType === "movie").length;
  const tvWatchlist = data.watchlist.filter((item) => item.mediaType === "tv").length;

  return (
    <div className="min-h-screen bg-black pb-16 text-white">
      <section className="relative overflow-hidden border-b border-[#01b4e4]/15 bg-[#032541]">
        <div className="pointer-events-none absolute -right-24 -top-40 h-96 w-96 rounded-full bg-[#01b4e4]/10 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14"
        >
          <div className="flex flex-col gap-8 flex-wrap md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-5 sm:gap-7">
              {data.user.image ? (
                <img
                  src={data.user.image}
                  alt={`${data.user.name}'s profile`}
                  className="size-24 shrink-0 rounded-full border-2 border-[#01b4e4]/50 object-cover sm:size-32"
                />
              ) : (
                <div className="flex size-24 shrink-0 items-center justify-center rounded-full border-2 border-[#01b4e4]/50 bg-[#01b4e4]/15 text-3xl font-semibold text-[#8ce8ff] sm:size-32 sm:text-4xl">
                  {getInitials(data.user.name) || <UserRound size={38} />}
                </div>
              )}
              <div className="min-w-0">
                <p className="mb-1 text-sm font-medium uppercase tracking-[0.2em] text-[#01b4e4]">
                  Your profile
                </p>
                <h1 className="truncate text-3xl font-bold sm:text-4xl">{data.user.name}</h1>
                <p className="mt-1 text-white/60">{data.user.username}</p>
                <div className="mt-4 flex flex-col gap-2 text-sm text-white/75 sm:flex-row sm:gap-5">
                  <span className="flex items-center gap-2">
                    <Mail size={16} className="text-[#01b4e4]" />
                    {data.user.email}
                  </span>
                  <span className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-[#01b4e4]" />
                    Member since {memberSince}
                  </span>
                </div>
                <ProfileEditDialog user={data.user} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-80">
              <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                <div className="flex items-center gap-2 text-white/65">
                  <Bookmark size={17} className="text-[#01b4e4]" /> Watchlist
                </div>
                <p className="mt-2 text-3xl font-bold">{data.watchlist.length}</p>
                <p className="mt-1 text-xs text-white/45">{movieWatchlist} movies | {tvWatchlist} TV shows</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                <div className="flex items-center gap-2 text-white/65">
                  <Heart size={17} className="text-pink-400" /> Favorites
                </div>
                <p className="mt-2 text-3xl font-bold">{data.favorites.length}</p>
                <p className="mt-1 text-xs text-white/45">{movieFavorites} movies | {tvFavorites} TV shows</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-5 pt-9 sm:px-8">
        <CollectionGroup title="Your watchlist" description="Titles you've saved to watch later.">
          <MediaSection title="Movies" mediaType="movie" items={data.watchlist} />
          <MediaSection title="TV shows" mediaType="tv" items={data.watchlist} />
        </CollectionGroup>

        <CollectionGroup title="Your favorites" description="Movies and shows you've marked as favorites.">
          <MediaSection title="Movies" mediaType="movie" items={data.favorites} />
          <MediaSection title="TV shows" mediaType="tv" items={data.favorites} />
        </CollectionGroup>
      </main>
    </div>
  );
}
