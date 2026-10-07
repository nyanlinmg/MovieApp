import MediaHeader from "@/components/MediaHeader";
import PeopleGrid from "@/components/PeopleGrid";
import { getMovieCredits, getMovieDetails } from "@/services/tmdb";

export default async function MovieCastPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const credits = await getMovieCredits(Number(id));
  const movie = await getMovieDetails(Number(id));

  const people = credits.cast.map((actor) => ({
    key: actor.credit_id,
    id: actor.id,
    name: actor.name,
    subtitle: actor.character,
    profile_path: actor.profile_path,
  }));

  return (
    <>
      <MediaHeader
        title={movie.title}
        year={movie.release_date?.slice(0, 4)}
        posterPath={movie.poster_path}
        backHref={`/movie/${id}`}
      />
      <PeopleGrid title="Cast" people={people} />
    </>
  );
}