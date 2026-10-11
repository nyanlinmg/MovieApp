import DiscoverPage, { DiscoverSearchParams } from "@/components/DiscoverPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<DiscoverSearchParams>;
}) {
  const sp = await searchParams;

  return <DiscoverPage title="Popular TV Shows" type="tv" sp={sp} />;
}