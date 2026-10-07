import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BackButton } from "./BackButton";

export default function MediaHeader({
  title,
  year,
  posterPath,
  backHref,
}: {
  title: string;
  year: string;
  posterPath: string | null;
  backHref: string;
}) {
  return (
    <div className="bg-linear-to-r from-neutral-900 to-neutral-800 px-10 py-5">
      <div className="flex items-center gap-5">
        {/* small poster */}
        {posterPath && (
          <img
            src={`https://image.tmdb.org/t/p/w154${posterPath}`}
            alt={title}
            className="h-40 w-30 rounded-md object-cover"
          />
        )}

        <div>
          {/* title + year */}
          <h1 className="text-3xl font-bold text-white">
            {title}{" "}
            {year && <span className="font-normal text-gray-300">({year})</span>}
          </h1>

          {/* back link */}
            <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-white"> 
                <BackButton /> 
            </div>
        </div>
      </div>
    </div>
  );
}