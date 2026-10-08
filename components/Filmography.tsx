"use client";

import { useState } from "react";
import { Film } from "lucide-react";
import Link from "next/link";

export default function Filmography({ credits }: { credits: any[] }) {
  const [filter, setFilter] = useState("all");

  // 1. filter by type
  const filtered = credits.filter(
    (c) => filter === "all" || c.media_type === filter
  );

  // 2. newest first
  const sorted = [...filtered].sort((a, b) => {
    const dateA = a.release_date || a.first_air_date || "";
    const dateB = b.release_date || b.first_air_date || "";
    return dateB.localeCompare(dateA);
  });

  if(!sorted.length) return;

  const activeButton = "rounded-full bg-cyan-500 px-4 py-1 cursor-pointer";
  const normalButton = "rounded-full border px-4 py-1 cursor-pointer";

  return (
    <section>
      <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold">
        Filmography <Film size={32} />
      </h2>

      {/* filter buttons */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? activeButton : normalButton}
        >
          All
        </button>
        <button
          onClick={() => setFilter("movie")}
          className={filter === "movie" ? activeButton : normalButton}
        >
          Movies
        </button>
        <button
          onClick={() => setFilter("tv")}
          className={filter === "tv" ? activeButton : normalButton}
        >
          TV Shows
        </button>
      </div>

      {/* list */}
      <div className="max-h-125 overflow-y-auto rounded-xl border border-mist-600 bg-[#111827]">
        {sorted.map((item) => {
          const title = item.title || item.name;
          const date = item.release_date || item.first_air_date;
          const year = date ? date.slice(0, 4) : "—";

          return (
            <Link
              key={item.credit_id}
              href={`/${item.media_type}/${item.id}`}
              className="flex gap-4 border-b border-mist-600 p-4 last:border-b-0 hover:bg-white/10"
            >
              <p className="w-12 font-mono text-gray-400">{year}</p>
              <div>
                <p className="font-semibold">{title}</p>
                {item.character && (
                  <p className="text-sm text-gray-400">as {item.character}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}