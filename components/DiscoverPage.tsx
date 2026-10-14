import { getDiscover, getGenres } from "@/services/tmdb";
import { StudioContentCard } from "@/components/StudioContentCard";
import { Pagination } from "@/components/Pagination";
import FilterPanel from "@/components/FilterPanel";
import { BackButton } from "./BackButton";

export type DiscoverSearchParams = {
  sortBy?: string;
  genres?: string;
  minRating?: string;
  yearFrom?: string;
  yearTo?: string;
  moviePage?: string;
  tvPage?: string;
};

export default async function DiscoverPage({
  title,
  type,
  defaultSort = "popularity.desc",
  extra,
  sp,
}: {
  title: string;
  type: "movie" | "tv";
  defaultSort?: string;
  extra?: Record<string, string>;
  sp: DiscoverSearchParams;
}) {
  // the URL choice wins, otherwise use this page's default
  const sortBy = sp.sortBy || defaultSort;
  const page = Number(type === "movie" ? sp.moviePage : sp.tvPage) || 1;

  // fetch the posters and the genre list at the same time
  const [data, genres] = await Promise.all([
    getDiscover(type, {
      sortBy,
      genres: sp.genres,
      minRating: sp.minRating,
      yearFrom: sp.yearFrom,
      yearTo: sp.yearTo,
      page,
      extra
    }),
    getGenres(type),
  ]);

  return (
    <div className="px-6 py-10 md:px-12">
      <div>
        <BackButton />
      </div>
      <h1 className="bg-linear-to-r from-white to-cyan-300 bg-clip-text font-serif text-4xl font-bold text-transparent">
        {title}
      </h1>
      <p className="mt-2 mb-8 text-sm text-gray-400">
        {data.total_results.toLocaleString()} results
      </p>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <FilterPanel
            genres={genres}
            initial={{
              sortBy,
              genres: sp.genres || "",
              minRating: sp.minRating || "",
              yearFrom: sp.yearFrom || "",
              yearTo: sp.yearTo || "",
            }}
          />
        </div>

        <div>
          {data.results.length ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {data.results.map((item) => (
                  <StudioContentCard key={item.id} item={item} type={type} />
                ))}
              </div>

              <Pagination
                paramPrefix={type}
                currentPage={page}
                totalPages={data.total_pages}
              />
            </>
          ) : (
            <p className="py-20 text-center text-gray-400">
              Nothing matches these filters. Try removing one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}