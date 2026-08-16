import { MovieType } from "@/types/global";

export function MoreDetail({ movie }: { movie: MovieType }) {
    const formatCurrency = (n: number) =>
        n > 0 ? `$${n.toLocaleString()}` : "N/A";

    return (
        <div className="px-8 py-12 md:px-16">
            <h2 className="mb-6 font-serif text-3xl font-bold">More Detail</h2>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Column 1 */}
                <div className="rounded-lg border border-gray-700 bg-[#111827] p-6">
                    <div className="mb-4">
                        <p className="text-sm text-gray-400">Release Date</p>
                        <p className="font-mono font-semibold">
                            {new Date(movie.release_date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-400">Status</p>
                        <p className="font-mono font-semibold">{movie.status}</p>
                    </div>
                    <div>
                        <p className="mb-2 text-sm text-gray-400">Production Countries</p>
                        <div className="flex flex-wrap gap-2">
                            {movie.production_countries?.map((c) => (
                                <span
                                    key={c.iso_3166_1}
                                    className="rounded-full border border-gray-600 px-3 py-1 font-mono text-xs"
                                >
                                    {c.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="rounded-lg border border-gray-700 bg-[#111827] p-6">
                    <div className="mb-4">
                        <p className="text-sm text-gray-400">Budget</p>
                        <p className="font-mono font-semibold">{formatCurrency(movie.budget)}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-400">Revenue</p>
                        <p className="font-mono font-semibold">{formatCurrency(movie.revenue)}</p>
                    </div>
                    <div>
                        <p className="mb-2 text-sm text-gray-400">Genres</p>
                        <div className="flex flex-wrap gap-2">
                            {movie.genres?.map((g) => (
                                <span
                                    key={g.id}
                                    className="rounded-full border border-gray-600 px-3 py-1 font-mono text-xs"
                                >
                                    {g.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 3 */}
                <div className="rounded-lg border border-gray-700 bg-[#111827] p-6">
                    <div className="mb-4">
                        <p className="text-sm text-gray-400">Vote Count</p>
                        <p className="font-mono font-semibold">{movie.vote_count.toLocaleString()}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-400">Popularity</p>
                        <p className="font-mono font-semibold">{Math.round(movie.popularity)}</p>
                    </div>
                    <div>
                        <p className="mb-2 text-sm text-gray-400">Studios</p>
                        <div className="flex flex-wrap gap-2">
                            {movie.production_companies?.map((c) => (
                                <span
                                    key={c.id}
                                    className="rounded-full border border-gray-600 px-3 py-1 font-mono text-xs"
                                >
                                    {c.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}