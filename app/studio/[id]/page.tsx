// app/studio/[id]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import {
    getCompanyDetails,
    getCompanyMovies,
    getCompanyTVShows,
} from "@/services/tmdb";
import { StudioContentCard } from "@/components/StudioContentCard";
import { SortMenu } from "@/components/SortMenu";
import { Pagination } from "@/components/Pagination";

const MOVIE_SORT_FIELDS = [
    { label: "Popularity", value: "popularity" },
    { label: "Rating", value: "vote_average" },
    { label: "Release Date", value: "release_date" },
];

const TV_SORT_FIELDS = [
    { label: "Popularity", value: "popularity" },
    { label: "Rating", value: "vote_average" },
    { label: "First Air Date", value: "first_air_date" },
];

export default async function StudioPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{
        moviePage?: string;
        movieSort?: string;
        tvPage?: string;
        tvSort?: string;
    }>;
}) {
    const { id } = await params;
    const sp = await searchParams;

    const companyId = Number(id);
    if (Number.isNaN(companyId)) notFound();

    const moviePage = Number(sp.moviePage) || 1;
    const movieSort = sp.movieSort || "popularity.desc";
    const tvPage = Number(sp.tvPage) || 1;
    const tvSort = sp.tvSort || "popularity.desc";

    const [company, moviesRes, tvRes] = await Promise.all([
        getCompanyDetails(companyId),
        getCompanyMovies(companyId, moviePage, movieSort),
        getCompanyTVShows(companyId, tvPage, tvSort),
    ]);

    if (!company?.id) notFound();

    // TMDB returns 20 results/page; slice to 18 so lg:grid-cols-6 renders as exactly 3 rows
    const movies = moviesRes.results.slice(0, 18);
    const tvShows = tvRes.results.slice(0, 18);
    const movieTotalPages = Math.min(moviesRes.total_pages, 500);
    const tvTotalPages = Math.min(tvRes.total_pages, 500);

    return (
        <div>
            {/* Header */}
            <div className="border-b border-gray-800 bg-[#0b1120] px-8 py-12 md:px-16">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex h-20 w-40 items-center justify-center rounded bg-white p-3">
                        {company.logo_path ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w300${company.logo_path}`}
                                alt={company.name}
                                width={140}
                                height={70}
                                className="h-full w-full object-contain"
                            />
                        ) : (
                            <span className="text-center font-serif text-lg font-bold text-black">
                                {company.name}
                            </span>
                        )}
                    </div>

                    <div>
                        <h1 className="font-serif text-3xl font-bold md:text-4xl">
                            {company.name}
                        </h1>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                            {company.origin_country && <span>{company.origin_country}</span>}
                            {company.headquarters && <span>{company.headquarters}</span>}
                            {company.homepage && (
                                
                                <a   href={company.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-white"
                                >
                                    Homepage
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="ml-auto text-right">
                        <p className="text-sm text-gray-400">Movies</p>
                        <p className="font-mono text-2xl font-bold">
                            {moviesRes.total_results?.toLocaleString() ?? "-"}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400">TV Shows</p>
                        <p className="font-mono text-2xl font-bold">
                            {tvRes.total_results?.toLocaleString() ?? "-"}
                        </p>
                    </div>
                </div>

                {company.description && (
                    <p className="mt-6 max-w-3xl text-sm text-gray-400">
                        {company.description}
                    </p>
                )}
            </div>

            {/* Movies */}
            <section className="px-8 py-12 md:px-16">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-serif text-2xl font-bold">Movies</h2>
                    <SortMenu paramPrefix="movie" fields={MOVIE_SORT_FIELDS} currentSortBy={movieSort} />
                </div>

                {movies.length ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {movies.map((movie) => (
                                <StudioContentCard key={movie.id} item={movie} type="movie" />
                            ))}
                        </div>
                        <Pagination paramPrefix="movie" currentPage={moviePage} totalPages={movieTotalPages} />
                    </>
                ) : (
                    <p className="text-sm text-gray-500">No movies found for this studio.</p>
                )}
            </section>

            {/* TV Shows */}
            <section className="px-8 pb-16 md:px-16">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-serif text-2xl font-bold">TV Shows</h2>
                    <SortMenu paramPrefix="tv" fields={TV_SORT_FIELDS} currentSortBy={tvSort} />
                </div>

                {tvShows.length ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {tvShows.map((show) => (
                                <StudioContentCard key={show.id} item={show} type="tv" />
                            ))}
                        </div>
                        <Pagination paramPrefix="tv" currentPage={tvPage} totalPages={tvTotalPages} />
                    </>
                ) : (
                    <p className="text-sm text-gray-500">No TV shows found for this studio.</p>
                )}
            </section>
        </div>
    );
}