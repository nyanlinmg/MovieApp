"use client";

import { useRouter } from "next/navigation";
import { Heart, Bookmark, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/Provider/AppProvider";
import { useMediaStatus, useToggleMedia } from "@/hooks/mediahook";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function MovieActions({
  title,
  trailerKey,
  tmdbId,
  mediaType,
}: {
  title: string;
  trailerKey?: string | null;
  tmdbId: number;
  mediaType: "movie" | "tv";
}) {
  const router = useRouter();
  const { auth } = useApp();

  // is it saved? (true / false)
  const isFavorite = useMediaStatus("favorites", tmdbId, mediaType);
  const isInWatchlist = useMediaStatus("watchlists", tmdbId, mediaType);

  // functions that add / remove
  const favoriteMutation = useToggleMedia("favorites", tmdbId, mediaType);
  const watchlistMutation = useToggleMedia("watchlists", tmdbId, mediaType);

  function handleFavorite() {
    if (!auth) return router.push("/login");
    favoriteMutation.mutate();
  }

  function handleWatchlist() {
    if (!auth) return router.push("/login");
    watchlistMutation.mutate();
  }

  const circle =
    "flex h-12 w-12 items-center justify-center rounded-full bg-[#032541] text-white transition hover:scale-110 cursor-pointer";

  return (
    <div className="mt-6 flex items-center gap-4">
      <button onClick={handleFavorite} className={circle}>
        <Heart className={cn("h-5 w-5", isFavorite && "fill-red-500 text-red-500")} />
      </button>

      <button onClick={handleWatchlist} className={circle}>
        <Bookmark className={cn("h-5 w-5", isInWatchlist && "fill-sky-400 text-sky-400")} />
      </button>

      {trailerKey && (
        <Dialog>
          <DialogTrigger className="flex items-center gap-2 font-semibold text-white cursor-pointer hover:text-white/70">
            <Play className="h-4 w-4 fill-white" />
            Play Trailer
          </DialogTrigger>

          <DialogContent
            aria-describedby={undefined}
            className="w-[95vw] overflow-hidden border-none bg-black p-0 duration-500 sm:max-w-5xl data-[state=open]:slide-in-from-top-[300%]"
        >
            <DialogTitle className="sr-only">{title} trailer</DialogTitle>
                <iframe
                    className="aspect-video w-full"
                    src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}