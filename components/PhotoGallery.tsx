"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Camera } from "lucide-react";

export default function PhotoGallery({ photos }: { photos: any[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  // nothing to show, so show nothing
  if (photos.length === 0) return null;

  return (
    <section>
      <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold">
        Photo Gallery <Camera size={32} />
      </h2>

        <div className="flex gap-5 overflow-x-auto pb-4">
        {photos.map((photo) => (
            <img
            key={photo.file_path}
            src={`https://image.tmdb.org/t/p/w342${photo.file_path}`}
            alt="actor photo"
            onClick={() => setSelected(photo.file_path)}
            className="h-70 w-50 shrink-0 cursor-pointer rounded-lg object-cover transition hover:scale-105"
            />
        ))}
        </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg border-0 bg-black p-0">
          <DialogTitle className="sr-only">Actor photo</DialogTitle>

          {selected && (
            <img
              src={`https://image.tmdb.org/t/p/original${selected}`}
              alt="actor photo"
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}