"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Check, ChevronDown, X } from "lucide-react";
import { Genre } from "@/types/global";

const SORT_OPTIONS = [
  { label: "Popularity", value: "popularity.desc" },
  { label: "Top Rated", value: "vote_average.desc" },
  { label: "Newest", value: "date.desc" },
];

const buttonStyle =
  "flex w-full cursor-pointer items-center justify-between rounded-lg bg-white/10 px-4 py-2.5 text-sm text-gray-200 outline-none transition hover:bg-white/20 focus:ring-2 focus:ring-cyan-400";
const listStyle =
  "mt-2 max-h-60 overflow-y-auto rounded-lg bg-black/30 p-2 [scrollbar-color:#334155_transparent] [scrollbar-width:thin]";
const labelStyle = "mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400";

export default function FilterPanel({
  genres,
  initial,
}: {
  genres: Genre[];
  initial: {
    sortBy: string;
    genres: string;
    minRating: string;
    yearFrom: string;
    yearTo: string;
  };
}) {
  const router = useRouter();
  const pathname = usePathname();

  // which list is open: "sort", "genres" or "" (none)
  const [openList, setOpenList] = useState("");

  const [sortBy, setSortBy] = useState(initial.sortBy);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initial.genres ? initial.genres.split(",") : []
  );
  const [minRating, setMinRating] = useState(initial.minRating || "0");
  const [yearFrom, setYearFrom] = useState(initial.yearFrom);
  const [yearTo, setYearTo] = useState(initial.yearTo);

  // open a list, or close it if it is already open
  const toggleList = (name: string) => {
    setOpenList(openList === name ? "" : name);
  };

  const toggleGenre = (id: string) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const apply = () => {
    const params = new URLSearchParams();
    params.set("sortBy", sortBy);
    if (selectedGenres.length) params.set("genres", selectedGenres.join(","));
    if (minRating !== "0") params.set("minRating", minRating);
    if (yearFrom) params.set("yearFrom", yearFrom);
    if (yearTo) params.set("yearTo", yearTo);

    router.push(`${pathname}?${params.toString()}`);
  };

  const reset = () => {
    setSortBy("popularity.desc");
    setSelectedGenres([]);
    setMinRating("0");
    setYearFrom("");
    setYearTo("");
    setOpenList("");
    router.push(pathname);
  };

  return (
    <aside className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      {/* Sort */}
      <div>
        <p className={labelStyle}>Sort by</p>

        <button onClick={() => toggleList("sort")} className={buttonStyle}>
          {SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Popularity"}
          <ChevronDown
            size={16}
            className={`transition-transform ${openList === "sort" ? "rotate-180" : ""}`}
          />
        </button>

        {openList === "sort" && (
          <div className={listStyle}>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSortBy(option.value);
                  setOpenList(""); // close after choosing
                }}
                className={`flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                  sortBy === option.value
                    ? "bg-cyan-400/20 text-cyan-300"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                {option.label}
                {sortBy === option.value && <Check size={14} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Genres */}
      <div>
        <p className={labelStyle}>Genres</p>

        <button onClick={() => toggleList("genres")} className={buttonStyle}>
          {selectedGenres.length ? `${selectedGenres.length} selected` : "Select genres"}
          <ChevronDown
            size={16}
            className={`transition-transform ${openList === "genres" ? "rotate-180" : ""}`}
          />
        </button>

        {openList === "genres" && (
          <div className={listStyle}>
            {genres.map((genre) => {
              const id = String(genre.id);
              const checked = selectedGenres.includes(id);

              return (
                <button
                  key={id}
                  onClick={() => toggleGenre(id)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                    checked ? "bg-cyan-400/20 text-cyan-300" : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      checked ? "border-cyan-400 bg-cyan-400 text-black" : "border-gray-500"
                    }`}
                  >
                    {checked && <Check size={12} />}
                  </span>
                  {genre.name}
                </button>
              );
            })}
          </div>
        )}

        {/* the chosen genres, click one to remove it */}
        {selectedGenres.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedGenres.map((id) => (
              <button
                key={id}
                onClick={() => toggleGenre(id)}
                className="flex cursor-pointer items-center gap-1 rounded-full bg-linear-to-r from-cyan-400 to-indigo-500 px-3 py-1 text-xs font-semibold text-black"
              >
                {genres.find((g) => String(g.id) === id)?.name}
                <X size={12} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Minimum rating */}
      <div>
        <p className={labelStyle}>
          Minimum rating{" "}
          <span className="text-cyan-400">
            {minRating === "0" ? "Any" : `${minRating}+ ★`}
          </span>
        </p>
        <input
          type="range"
          min={0}
          max={9}
          step={1}
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="w-full cursor-pointer accent-cyan-400"
        />
      </div>

      {/* Year range */}
      <div>
        <p className={labelStyle}>Release year</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="From"
            min={1900}
            max={2030}
            value={yearFrom}
            onChange={(e) => setYearFrom(e.target.value)}
            className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <span className="text-gray-500">–</span>
          <input
            type="number"
            placeholder="To"
            min={1900}
            max={2030}
            value={yearTo}
            onChange={(e) => setYearTo(e.target.value)}
            className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={apply}
          className="flex-1 cursor-pointer rounded-lg bg-linear-to-r from-cyan-400 to-indigo-500 py-2.5 font-semibold text-black transition hover:opacity-90"
        >
          Apply
        </button>
        <button
          onClick={reset}
          className="cursor-pointer rounded-lg border border-white/20 px-4 py-2.5 text-gray-300 transition hover:bg-white/10"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}