// app/tv/[id]/page.tsx
import Image from "next/image";
import {
  getTvDetails,
  getTvCredits,
  getTvRecommendations,
  getTvVideos,
} from "@/services/tmdb";

import CastSection from "@/components/CastSection";
import CrewSection from "@/components/CrewSection";
import RelatedMovies from "@/components/RelatedMoies";
import ReviewSection from "@/components/ReviewSection";
import TvHero from "@/components/TvHero";
import TvTrailer from "@/components/TvTrailer";
import { TvMoreDetail } from "@/components/TvMoreDetails";

interface TvDetailsPageProps {
  params: Promise<{ id: string }>;
}

const image_url = "http://image.tmdb.org/t/p/w1280";
const poster_url = "http://image.tmdb.org/t/p/w500";

export default async function TvDetailsPage({ params }: TvDetailsPageProps) {
  const { id } = await params;
  const tvId = Number(id);

  const [tv, credits, recommendations, videos] = await Promise.all([
    getTvDetails(tvId),
    getTvCredits(tvId),
    getTvRecommendations(tvId),
    getTvVideos(Number(id))
  ]);

  const year = tv.first_air_date?.slice(0, 4);
  const episodeRuntime = tv.episode_run_time?.[0] ?? null;
  const crew = credits?.crew ?? [];
  const directors = crew.filter((person) => person.job === "Director");
  const writers = crew.filter((person) => person.job === "Writer" || person.job === "Screenplay");
  const producers = crew.filter((person) => person.job === "Producer");
  const composers = crew.filter((person) => person.job === "Original Music Composer");
  const keyCrew = [...directors, ...writers, ...producers, ...composers].slice(0, 12);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero */}
      <TvHero tv={tv} videos={videos} />

      {/* More Details */}
      <TvMoreDetail tv={tv} />

      <TvTrailer videos={videos} tv={tv} />

      {/* Cast */}
      <CastSection cast={credits.cast} id={tv.id} basePath="tv" />

      {/* Crew */}
      <CrewSection crew={keyCrew} id={tv.id} basePath="tv" />

      {/* Reviews */}
      <ReviewSection
        key={`tv-${tv.id}`}
        tmdbId={tv.id}
        mediaType="tv"
        mediaTitle={tv.name}
      />

      {/* Related */}
      <div className="px-10 py-6">
        <RelatedMovies movies={recommendations} basePath="tv" />
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-zinc-500">{label}</p>
      <p className="text-white mt-1">{value || "—"}</p>
    </div>
  );
}
