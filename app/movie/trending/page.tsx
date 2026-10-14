import DiscoverPage, { DiscoverSearchParams } from "@/components/DiscoverPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<DiscoverSearchParams>;
}) {
  const sp = await searchParams;

  // movies released in the last 60 days, up to today
  const oneDay = 24 * 60 * 60 * 1000;
  const today = new Date().toISOString().split("T")[0];
  const sixtyDaysAgo = new Date(Date.now() - 60 * oneDay).toISOString().split("T")[0];

  return (
    <DiscoverPage
      title="Trending Movies"
      type="movie"
      extra={{
        "primary_release_date.gte": sixtyDaysAgo,
        "primary_release_date.lte": today,
      }}
      sp={sp}
    />
  );
}