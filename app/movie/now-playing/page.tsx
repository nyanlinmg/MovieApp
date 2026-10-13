import DiscoverPage, { DiscoverSearchParams } from "@/components/DiscoverPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<DiscoverSearchParams>;
}) {
  const sp = await searchParams;

  // today's date, like "2026-10-13"
  const today = new Date().toISOString().split("T")[0];

  // about 6 weeks ago — movies still in theaters
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 42);
  const from = fromDate.toISOString().split("T")[0];

  return (
    <DiscoverPage
      title="Now Playing"
      type="movie"
      extra={{
        "primary_release_date.lte": today,
        "primary_release_date.gte": from,
      }}
      sp={sp}
    />
  );
}
