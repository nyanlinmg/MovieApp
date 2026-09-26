import Image from "next/image";
import Link from "next/link";
import { StudioContentItem } from "@/types/global";

export function StudioContentCard({
    item,
    type,
}: {
    item: StudioContentItem;
    type: "movie" | "tv";
}) {
    const title = item.title ?? item.name ?? "Untitled";
    const date = item.release_date ?? item.first_air_date;
    const year = date ? new Date(date).getFullYear() : null;

    return (
        <Link
            href={`/${type}/${item.id}`}
            className="group block overflow-hidden rounded-lg border border-gray-700 bg-[#111827] transition-transform hover:-translate-y-1"
        >
            <div className="relative aspect-2/3 w-full bg-gray-800">
                {item.poster_path ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                        alt={title}
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-500 px-2 text-center">
                        {title}
                    </div>
                )}
            </div>
            <div className="p-3">
                <p className="truncate font-mono text-sm font-semibold group-hover:text-white">
                    {title}
                </p>
                <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
                    <span>{year ?? "N/A"}</span>
                    <span>★ {item.vote_average.toFixed(1)}</span>
                </div>
            </div>
        </Link>
    );
}