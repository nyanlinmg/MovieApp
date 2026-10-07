import MediaHeader from "@/components/MediaHeader";
import PeopleGrid from "@/components/PeopleGrid";
import { getTvCredits, getTvDetails } from "@/services/tmdb";

export default async function MovieCastPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const credits = await getTvCredits(Number(id));
  const tv = await getTvDetails(Number(id));

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
        title={tv.name}
        year={tv.first_air_date?.slice(0, 4)}
        posterPath={tv.poster_path}
        backHref={`/tv/${id}`}
      />
      <PeopleGrid title="Cast" people={people} />
    </>
  );
}