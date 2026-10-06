import { PersonCredit } from "@/types/global";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { Star } from "lucide-react";

export default function KnownFor({items} : {items: PersonCredit[]}) {
    if(items.length === 0) return null;

    return (
        <section>
            <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold">
                Known For <Star size={32} />
            </h2>

            <Carousel opts={{align: "start", dragFree: true}} className="w-full px-12">
                <CarouselContent className="-ml-4">
                    {items.map((item, index) => (
                        <CarouselItem 
                            key={`${item.media_type}-${item.id}-${index}`} className="pl-2 md:pl-4 lg:pl-5 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-[16%]">
                            <Link href={`/${item.media_type}/${item.id}`}>
                                <div className="relative overflow-hidden rounded-lg bg-white/10">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                                        alt={item.title ?? item.name ?? ""}
                                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                                    />
                                </div>
                                <p className="mt-3 line-clamp-2 text-sm font-medium text-white text-center">
                                    {item.title ?? item.name}
                                </p>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 cursor-pointer" />
                <CarouselNext className="right-0 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 cursor-pointer" />
            </Carousel>
        </section>
    )
}