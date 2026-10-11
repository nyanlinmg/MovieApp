import DiscoverPage, { DiscoverSearchParams } from "@/components/DiscoverPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<DiscoverSearchParams>;
}) {
  const sp = await searchParams;

  return (
    <DiscoverPage
      title="Top Rated Movies"
      type="movie"
      defaultSort="vote_average.desc"
      sp={sp}
    />
  );
}