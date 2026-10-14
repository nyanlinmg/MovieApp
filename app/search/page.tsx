import { BackButton } from "@/components/BackButton";
import SearchBox from "@/components/SearchBox";
import { StudioContentCard } from "@/components/StudioContentCard";
import { getSearchResults } from "@/services/tmdb";
import type { StudioContentItem } from "@/types/global";

export const dynamic = "force-dynamic";

function ResultSection({
  title,
  items,
  type,
}: {
  title: string;
  items: StudioContentItem[];
  type: "movie" | "tv";
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between gap-4 border-b border-white/10 pb-3">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="text-sm text-gray-400">{items.length} results</span>
      </div>

      {items.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <StudioContentCard key={`${type}-${item.id}`} item={item} type={type} />
          ))}
        </div>
      ) : (
        <p className="py-8 text-gray-400">No {title.toLowerCase()} found.</p>
      )}
    </section>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q?.trim() || "";
  const { movies, tvShows } = q
    ? await getSearchResults(q)
    : { movies: [], tvShows: [] };

  return (
    <div className="min-h-screen bg-black px-6 py-10 md:px-12">
      <BackButton />

      <div className="max-w-2xl">
        <h1 className="bg-linear-to-r from-white to-cyan-300 bg-clip-text font-serif text-4xl font-bold text-transparent">
          Search
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Find movies and TV shows by title.
        </p>

        <SearchBox key={q} defaultValue={q} className="mt-6" />
      </div>

      {q ? (
        <>
          <p className="mt-8 text-gray-300">
            Search results for <span className="font-semibold text-white">{q}</span>
          </p>

          <ResultSection title="Movies" items={movies} type="movie" />
          <ResultSection title="TV Shows" items={tvShows} type="tv" />
        </>
      ) : (
        <p className="mt-12 max-w-xl text-gray-400">
          Start typing in the search box. Suggestions will appear for movie and
          TV show titles that start with what you type.
        </p>
      )}
    </div>
  );
}
