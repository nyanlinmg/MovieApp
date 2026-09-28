"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortField = { label: string; value: string };

const menuSurface = "border-gray-700 bg-[#111827] text-gray-300";
const menuItem = "focus:bg-gray-800 focus:text-gray-100";

export function SortMenu({
    paramPrefix,
    fields,
    currentSortBy,
}: {
    paramPrefix: "movie" | "tv";
    fields: SortField[];
    currentSortBy: string; // e.g. "popularity.desc"
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function applySort(field: string, order: "asc" | "desc") {
        const params = new URLSearchParams(searchParams.toString());
        params.set(`${paramPrefix}Sort`, `${field}.${order}`);
        params.set(`${paramPrefix}Page`, "1");
        router.replace(`${pathname}?${params.toString()}`);
    }

    const [currentField] = currentSortBy.split(".");
    const currentLabel = fields.find((f) => f.value === currentField)?.label ?? "Sort";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="group flex items-center gap-1 rounded border border-gray-700 px-3 py-1.5 text-sm text-gray-300 outline-none hover:border-gray-500 data-[state=open]:border-gray-500">
                {currentLabel}
                <ChevronDown size={14} className="group-data-[state=open]:hidden" />
                <ChevronUp size={14} className="hidden group-data-[state=open]:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className={`w-40 ${menuSurface}`}>
                {fields.map((field) => (
                    <DropdownMenuSub key={field.value}>
                        <DropdownMenuSubTrigger
                            className={`${menuItem} data-[state=open]:bg-gray-800 data-[state=open]:text-gray-100`}
                        >
                            {field.label}
                        </DropdownMenuSubTrigger>

                        <DropdownMenuSubContent className={`w-32 ${menuSurface}`}>
                            <DropdownMenuItem
                                className={menuItem}
                                onSelect={() => applySort(field.value, "desc")}
                            >
                                Descending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className={menuItem}
                                onSelect={() => applySort(field.value, "asc")}
                            >
                                Ascending
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}