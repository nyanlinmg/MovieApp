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
      title="Upcoming TV Shows"
      type="tv"
      extra={{ "first_air_date.gte": today }}
      sp={sp}
    />
  );
}
