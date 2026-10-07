import MediaHeader from "@/components/MediaHeader";
import PeopleGrid from "@/components/PeopleGrid";
import { getMovieCredits, getMovieDetails } from "@/services/tmdb";

export default async function MovieCrewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const credits = await getMovieCredits(Number(id));
  const movie = await getMovieDetails(Number(id));

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
        title={movie.title}
        year={movie.release_date?.slice(0, 4)}
        posterPath={movie.poster_path}
        backHref={`/movie/${id}`}
        />
        <PeopleGrid title="Crew" people={people} />
  </>
  );
}