import MediaHeader from "@/components/MediaHeader";
import PeopleGrid from "@/components/PeopleGrid";
import { getTvCredits, getTvDetails } from "@/services/tmdb";

export default async function TVCrewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const credits = await getTvCredits(Number(id));
  const tv = await getTvDetails(Number(id));

  const people = credits.crew.map((person, index) => ({
    key: `${person.id}-${person.job}-${index}`,
    id: person.id,
    name: person.name,
    subtitle: person.job,
    profile_path: person.profile_path,
  }));

  return (
    <>
        <MediaHeader
        title={tv.name}
        year={tv.first_air_date?.slice(0, 4)}
        posterPath={tv.poster_path}
        backHref={`/tv/${id}`}
        />
        <PeopleGrid title="Crew" people={people} />
    </>
  );
}