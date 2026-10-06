import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CrewMember } from "@/types/global";
import { Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CrewSectionProps {
  crew: CrewMember[];
  id: number;
  basePath?: "movie" | "tv";
}

export default function CrewSection({ crew, id, basePath = "movie" } : CrewSectionProps) {
  if (crew.length === 0) return null;

  return (
    <div className="w-full px-10 py-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="mb-8 text-3xl font-bold flex items-center gap-3">
          Crew Members <Clapperboard size={32} />
        </h2>

        <Link href={`/${basePath}/${id}/crew`}>
          <Button variant="outline" className="bg-[#111827] px-5 py-4 border-mist-600 cursor-pointer" size="lg">
            View All
          </Button>
        </Link>
      </div>

      <Carousel opts={{ align: "start", dragFree: true }} className="w-full px-12">
        <CarouselContent>
          {crew.map((person) => (
            <CarouselItem
              key={`${person.id}-${person.job}`}
              className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/5 xl:basis-[15%]"
            >
              <Link href={`/person/${person.id}`}>
                <div className="overflow-hidden rounded-lg border-2 border-mist-600">
                  <img
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                        : "/no_profile.svg"
                    }
                    alt={person.name}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-110 cursor-pointer"
                  />
                  <div className="bg-[#111827] p-3">
                    <p className="truncate text-sm font-semibold">{person.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{person.job}</p>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 bg-mist-600" />
        <CarouselNext className="right-0 bg-mist-600" />
      </Carousel>
    </div>
  );
}