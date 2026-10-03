import { notFound } from "next/navigation";
import { getPerson } from "@/services/tmdb";
import PersonHero from "@/components/PersonHero";

export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = await getPerson(Number(id));

  if (!person) notFound();

  return (
    <main className="flex flex-col gap-10 px-6 py-8 lg:px-10">
        <PersonHero 
            name={person.name}
            profilePath={person.profile_path}
            biography={person.biography}
        />
    </main>
  );
}