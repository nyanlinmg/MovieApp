"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SearchSuggestion } from "@/types/global";

type SearchBoxProps = {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
};

export default function SearchBox({
  defaultValue = "",
  placeholder = "Search for a movie, tv show...",
  className,
  inputClassName,
  buttonClassName,
}: SearchBoxProps) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      return;
    }

    let ignoreResult = false;

    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search-suggestions?q=${encodeURIComponent(cleanQuery)}`
        );

        if (!res.ok) return;

        const data = (await res.json()) as SearchSuggestion[];

        if (!ignoreResult) {
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        }
      } catch {
        if (!ignoreResult) {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    }, 250);

    return () => {
      ignoreResult = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const cleanQuery = query.trim();

    if (cleanQuery) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(cleanQuery)}`);
    }
  }

  return (
    <div
      className={cn("relative w-full", className)}
      onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
    >
      <form onSubmit={handleSearch} className="flex w-full gap-2">
        <Input
          value={query}
          onChange={(e) => {
            const nextQuery = e.target.value;
            setQuery(nextQuery);

            if (!nextQuery.trim()) {
              setSuggestions([]);
              setShowSuggestions(false);
            }
          }}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          placeholder={placeholder}
          className={cn("h-12 bg-white text-black", inputClassName)}
        />

        <Button
          type="submit"
          aria-label="Search"
          className={cn(
            "h-12 px-6 bg-[#01b4e4] hover:bg-[#01b4e4]/80 cursor-pointer",
            buttonClassName
          )}
        >
          <Search size={18} />
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 top-full z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-lg border border-[#01b4e4]/30 bg-[#071827] p-2 text-left shadow-2xl">
          {suggestions.map((item) => (
            <Link
              key={`${item.mediaType}-${item.id}`}
              href={`/${item.mediaType}/${item.id}`}
              onClick={() => setShowSuggestions(false)}
              className="flex items-center gap-3 rounded-md p-2 transition hover:bg-[#01b4e4]/20"
            >
              {item.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                  alt={item.title}
                  className="h-16 w-11 rounded object-cover"
                />
              ) : (
                <div className="flex h-16 w-11 items-center justify-center rounded bg-white/10 text-xs text-white/50">
                  N/A
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {item.title}
                </p>
                <p className="text-xs text-gray-400">
                  {item.mediaType === "movie" ? "Movie" : "TV Show"} -{" "}
                  {item.year}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
