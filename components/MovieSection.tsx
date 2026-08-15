"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MovieType, TvType } from "@/types/global";
import Movie from "@/components/movie";

interface MovieSectionProps {
  title: string;
  items: (MovieType | TvType)[];
  mediaType: "movie" | "tv";
  viewAllHref: string;
}

export default function MovieSection({
  title,
  items,
  mediaType,
  viewAllHref,
}: MovieSectionProps) {
  return (
    <motion.section
      // Section fades up into view once, when it scrolls onto screen
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{amount: 0.2 }}
      transition={{ duration: 0.8 }}
      className="px-6 py-8 mx-10"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-sm text-[#01b4e4] hover:text-[#01b4e4]/80"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
        <CarouselContent className="-ml-2 flex gap-4">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-2 basis-auto">
              <Movie item={item} mediaType={mediaType} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex text-black" />
        <CarouselNext className="hidden md:flex text-black" />
      </Carousel>
    </motion.section>
  );
}