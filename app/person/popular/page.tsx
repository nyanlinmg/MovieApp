import PeopleGrid from "@/components/PeopleGrid";
import { Pagination } from "@/components/Pagination";
import { getPopularPeople } from "@/services/tmdb";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ personPage?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.personPage) || 1;
  const data = await getPopularPeople(page);

  const people = data.results.map((person) => ({
    key: String(person.id),
    id: person.id,
    name: person.name,
    subtitle: person.known_for_department,
    profile_path: person.profile_path,
  }));

  return (
    <>
      <PeopleGrid title="Popular People" people={people} />
      <Pagination
        paramPrefix="person"
        currentPage={page}
        totalPages={data.total_pages}
      />
      <div className="mt-6 text-center text-gray-500 max-w-2xl mx-auto mb-10">
        <p>
          This page shows the most popular people on the platform. The list is updated daily.
        </p>
      </div>
      <div className="py-3"></div>
    </>
  );
}
