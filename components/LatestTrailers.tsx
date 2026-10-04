"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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

export default function LatestTrailers({ trailers }: { trailers: any[] }) {
  const [selected, setSelected] = useState<any>(null);

  return (
    <motion.section 
      initial={{opacity: 0, y: 24}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{ amount: 0.2}}
      transition={{ duration: 0.5}}
      className="bg-[#032542] relative overflow-hidden px-10 py-8">
        {trailers[0]?.image && (
            <img 
                src={`https://image.tmdb.org/t/p/w1280${trailers[2].image}`}
                alt="backdrop_image"
                className="object-cover absolute inset-0 h-full w-full"
            />
        )}

      <div className="absolute inset-0 bg-[#032541]/80"></div>

      <div className="relative z-10">
        <h2 className="mb-5 text-2xl font-semibold text-white">Latest Trailers</h2>

        <motion.div 
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{amount: 0.2}}
          className="flex gap-5 overflow-x-auto pb-4">
            {trailers.map((t) => (
            <motion.div
                key={t.id}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelected(t)}
                className="w-93.75 shrink-0 cursor-pointer text-center text-white"
            >
                <div className="relative h-52.5 overflow-hidden rounded-lg">
                  <img
                      src={`https://image.tmdb.org/t/p/w780${t.image}`}
                      alt={t.title}
                      className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{t.title}</h3>
                <p className="text-sm">{t.videoName}</p>
            </motion.div>
            ))}
        </motion.div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="w-[95vw] overflow-hidden border-none bg-black p-0 duration-500 sm:max-w-5xl data-[state=open]:slide-in-from-top-[300%]">
          <DialogTitle className="sr-only">{selected?.title}</DialogTitle>

          {selected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="aspect-video w-full"
            >
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${selected.videoKey}?autoplay=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </motion.section>
  );
}