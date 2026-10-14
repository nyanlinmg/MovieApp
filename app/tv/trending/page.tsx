import DiscoverPage, { DiscoverSearchParams } from "@/components/DiscoverPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<DiscoverSearchParams>;
}) {
  const sp = await searchParams;

  // shows with an episode aired in the last 30 days
  const oneDay = 24 * 60 * 60 * 1000;
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * oneDay).toISOString().split("T")[0];

  return (
    <DiscoverPage
      title="Trending TV Shows"
      type="tv"
      extra={{
        "air_date.gte": thirtyDaysAgo,
        "air_date.lte": today,
      }}
      sp={sp}
    />
  );
}