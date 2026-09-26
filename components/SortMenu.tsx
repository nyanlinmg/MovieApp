"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";

type SortField = { label: string; value: string };

export function SortMenu({
    paramPrefix,
    fields,
    currentSortBy,
}: {
    paramPrefix: "movie" | "tv";
    fields: SortField[];
    currentSortBy: string; // e.g. "popularity.desc"
}) {
    const [open, setOpen] = useState(false);
    const [activeField, setActiveField] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
                setActiveField(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function applySort(field: string, order: "asc" | "desc") {
        const params = new URLSearchParams(searchParams.toString());
        params.set(`${paramPrefix}Sort`, `${field}.${order}`);
        params.set(`${paramPrefix}Page`, "1");
        router.push(`${pathname}?${params.toString()}`);
        setOpen(false);
        setActiveField(null);
    }

    const [currentField] = currentSortBy.split(".");
    const currentLabel = fields.find((f) => f.value === currentField)?.label ?? "Sort";

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1 rounded border border-gray-700 px-3 py-1.5 text-sm text-gray-300 hover:border-gray-500"
            >
                {currentLabel} <ChevronDown size={14} />
            </button>

            {open && (
                <div className="absolute right-0 z-20 mt-1 w-40 rounded border border-gray-700 bg-[#111827] py-1 shadow-lg">
                    {fields.map((field) => (
                        <div
                            key={field.value}
                            className="relative"
                            onMouseEnter={() => setActiveField(field.value)}
                        >
                            <button className="flex w-full items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-gray-800">
                                {field.label} <ChevronRight size={14} />
                            </button>

                            {activeField === field.value && (
                                <div className="absolute right-full top-0 mr-1 w-32 rounded border border-gray-700 bg-[#111827] py-1 shadow-lg">
                                    <button
                                        onClick={() => applySort(field.value, "desc")}
                                        className="block w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800"
                                    >
                                        Descending
                                    </button>
                                    <button
                                        onClick={() => applySort(field.value, "asc")}
                                        className="block w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800"
                                    >
                                        Ascending
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}