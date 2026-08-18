// components/movie/CastSection.tsx
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

interface CastSectionProps {
  cast: CastMember[];
  movieId: number;
}

export default function CastSection({ cast, movieId }: CastSectionProps) {
  if (!cast || cast.length === 0) return null;

  return (
    <div className="w-full px-10 py-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Top Billed Cast</h2>
        <Link href={`/movie/${movieId}/cast`}>
          <Button variant="outline" className="bg-[#111827] px-5 py-4 border-mist-600 cursor-pointer" size="lg">
            View All
          </Button>
        </Link>
      </div>

      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="w-full px-12"
      >
        <CarouselContent>
          {cast.map((actor) => (
            <CarouselItem
              key={actor.id}
              className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-[14%]"
            >
              <div className="rounded-lg overflow-hidden border-2 border-mist-600 bg-card">
                <div className="relative aspect-22/3  w-full bg-muted">
                  {actor.profile_path ? (
                    <img 
                        src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                        alt={actor?.name}
                        className="object-cover"
                    />
                  ) : (
                      <img src="/no_profile.svg" alt="" className="w-full" />
                  )}
                </div>
                <div className="p-3 bg-[#111827]">
                  <p className="font-semibold text-sm leading-tight truncate">
                    {actor.name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {actor.character}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 bg-mist-600" />
        <CarouselNext className="right-0 bg-mist-600" />
      </Carousel>
    </div>
  );
}