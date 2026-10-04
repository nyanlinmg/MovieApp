import { notFound } from "next/navigation";
import { getPerson } from "@/services/tmdb";
import PersonHero from "@/components/PersonHero";
import KnownFor from "@/components/KnownFor";
import PersonalInfo from "@/components/PersonalInfo";

export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = await getPerson(Number(id));

  const allCredists = [
    ...person.combined_credits.cast,
    ...person.combined_credits.crew
  ]

  const knownFor = allCredists
  .filter((c) => c.poster_path)
  .filter((c) => c.media_type === "movie")   // new line: movies only
  .filter(
    (c, index, list) =>
      list.findIndex((x) => x.id === c.id && x.media_type === c.media_type) === index
  )
  .sort((a, b) => b.popularity - a.popularity)
  .slice(0, 12);

  if (!person) notFound();

  return (
    <main className="flex flex-col gap-10 px-6 py-8 lg:px-10">
        <PersonHero 
            name={person.name}
            profilePath={person.profile_path}
            biography={person.biography}
        />

      <KnownFor items={knownFor} />

      <PersonalInfo
        department={person.known_for_department}
        credits={person.combined_credits.cast.length + person.combined_credits.crew.length}
        gender={person.gender}
        popularity={person.popularity}
        birthday={person.birthday}
        deathday={person.deathday}
        placeOfBirth={person.place_of_birth}
        homepage={person.homepage}
        alsoKnownAs={person.also_known_as}
        externalIds={person.external_ids}
      />
    </main>
  );
}