import Link from "next/link";
import { Film, Star, Tv } from "lucide-react";
import type { ProfileMediaItem } from "@/services/userServices";

export default function ProfileMediaCard({ item }: { item: ProfileMediaItem }) {
  const year = item.date ? item.date.slice(0, 4) : null;

  return (
    <Link
      href={`/${item.mediaType}/${item.id}`}
      className="group block min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#032541] transition hover:-translate-y-1 hover:border-[#01b4e4]/60"
    >
      {item.posterPath ? (
        <img
          src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
          alt={`${item.title} poster`}
          loading="lazy"
          className="aspect-2/3 w-full object-cover"
        />
      ) : (
        <div className="flex aspect-2/3 items-center justify-center bg-white/5 text-white/40">
          {item.mediaType === "movie" ? <Film size={34} /> : <Tv size={34} />}
        </div>
      )}
      <div className="space-y-1 p-3">
        <p className="line-clamp-2 min-h-10 font-medium text-white group-hover:text-[#01b4e4]">
          {item.title}
        </p>
        <div className="flex items-center justify-between gap-2 text-sm text-white/60">
          <span>{year || "Release date unknown"}</span>
          <span className="flex items-center gap-1">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            {item.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
