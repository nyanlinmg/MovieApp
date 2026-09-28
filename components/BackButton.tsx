"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton({ fallbackHref = "/" }: { fallbackHref?: string }) {
    const router = useRouter();

    function handleBack() {
        // If the user opened this page directly (no history), go to a fallback
        if (window.history.length > 1) router.back();
        else router.push(fallbackHref);
    }

    return (
        <button
            onClick={handleBack}
            className="mb-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer"
        >
            <ArrowLeft size={18} /> <span className="text-lg">Back to previous page</span>
        </button>
    );
}