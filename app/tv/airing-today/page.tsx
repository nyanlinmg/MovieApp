import DiscoverPage, { DiscoverSearchParams } from "@/components/DiscoverPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<DiscoverSearchParams>;
}) {
  const sp = await searchParams;

  // today's date, like "2026-10-13"
  const today = new Date().toISOString().split("T")[0];

  return (
    <DiscoverPage
      title="Airing Today"
      type="tv"
      extra={{
        "air_date.gte": today,
        "air_date.lte": today,
      }}
      sp={sp}
    />
  );
}
