// components/movie/RelatedMovies.tsx
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MovieType, TvType } from "@/types/global";

interface RelatedMoviesProps {
  movies: (MovieType | TvType)[];
  basePath?: "movie" | "tv";
}

function getTitle(item: MovieType | TvType) {
  return "title" in item ? item.title : item.name;
}

function getYear(item: MovieType | TvType) {
  const date = "release_date" in item ? item.release_date : item.first_air_date;
  return date?.slice(0, 4);
}

export default function RelatedMovies({ movies, basePath = "movie" }: RelatedMoviesProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Related {basePath === "tv" ? "Shows" : "Movies"}</h2>

      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className="-ml-4">
          {movies.map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <Link href={`/${basePath}/${item.id}`}>
                <div className="rounded-lg overflow-hidden border border-white/10 bg-zinc-900">
                  <div className="relative aspect-[2/3] w-full bg-zinc-800 overflow-hidden">
                    {item.poster_path ? (
                        <img 
                            src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                            alt={getTitle(item)}
                            className="object-cover transition-transform duration-300 hover:scale-110"
                            sizes="(max-width: 768px) 50vw, 200px"
                        />
                    ) : (
                      <img src="/no_profile.svg" alt="" className="w-full" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm leading-tight truncate text-white">
                      {getTitle(item)}
                    </p>
                    <p className="text-xs text-zinc-400">{getYear(item)}</p>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700" />
        <CarouselNext className="right-0 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700" />
      </Carousel>
    </div>
  );
}