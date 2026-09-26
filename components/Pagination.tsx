"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function Pagination({
    paramPrefix,
    currentPage,
    totalPages,
}: {
    paramPrefix: "movie" | "tv";
    currentPage: number;
    totalPages: number;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function goToPage(page: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(`${paramPrefix}Page`, String(page));
        router.push(`${pathname}?${params.toString()}`);
    }

    if (totalPages <= 1) return null;

    return (
        <div className="mt-6 flex items-center justify-center gap-3">
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="rounded border border-gray-700 px-3 py-1 text-sm disabled:opacity-40"
            >
                Prev
            </button>
            <span className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="rounded border border-gray-700 px-3 py-1 text-sm disabled:opacity-40"
            >
                Next
            </button>
        </div>
    );
}