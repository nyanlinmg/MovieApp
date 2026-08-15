"use client";

import { useState } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieType, TvType } from "@/types/global";
import Movie from "@/components/movie";

interface FilterableMovieSectionProps {
  title: string;
  movieItems: MovieType[];
  tvItems: TvType[];
  movieViewAllHref: string;
  tvViewAllHref: string;
}

const cardContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function FilterableMovieSection({
  title,
  movieItems,
  tvItems,
  movieViewAllHref,
  tvViewAllHref,
}: FilterableMovieSectionProps) {
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");

  const items = mediaType === "movie" ? movieItems : tvItems;
  const viewAllHref = mediaType === "movie" ? movieViewAllHref : tvViewAllHref;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="px-6 py-8 mx-10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>

          <Tabs
            value={mediaType}
            onValueChange={(value) => setMediaType(value as "movie" | "tv")}
          >
            <TabsList className="bg-white/10">
              <TabsTrigger
                value="movie"
                className="cursor-pointer data-[state=active]:bg-[#01b4e4] data-[state=active]:text-white text-white/70"
              >
                Movies
              </TabsTrigger>
              <TabsTrigger
                value="tv"
                className="cursor-pointer data-[state=active]:bg-[#01b4e4] data-[state=active]:text-white text-white/70"
              >
                TV Shows
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-sm text-[#01b4e4] hover:text-[#01b4e4]/80"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={mediaType}
            variants={cardContainerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
          >
            <CarouselContent className="-ml-2">
              {items.map((item) => (
                <CarouselItem key={item.id} className="pl-2 basis-auto">
                  <motion.div variants={cardVariants}>
                    <Movie item={item} mediaType={mediaType} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </motion.div>
        </AnimatePresence>
        <CarouselPrevious className="hidden md:flex text-black" />
        <CarouselNext className="hidden md:flex text-black" />
      </Carousel>
    </motion.section>
  );
}