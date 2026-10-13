import DiscoverPage, { DiscoverSearchParams } from "@/components/DiscoverPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<DiscoverSearchParams>;
}) {
  const sp = await searchParams;

  // today's date, like "2026-10-13"
  const today = new Date().toISOString().split("T")[0];

  // one week from today — shows with an episode this week
  const weekLater = new Date();
  weekLater.setDate(weekLater.getDate() + 7);
  const nextWeek = weekLater.toISOString().split("T")[0];

  return (
    <DiscoverPage
      title="On TV"
      type="tv"
      extra={{
        "air_date.gte": today,
        "air_date.lte": nextWeek,
      }}
      sp={sp}
    />
  );
}
