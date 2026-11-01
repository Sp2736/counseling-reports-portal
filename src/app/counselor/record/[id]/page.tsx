import RecordReviewClient from "./RecordReviewClient";

export function generateStaticParams() {
  return [
    { id: "rec-1" },
    { id: "rec-2" },
    { id: "rec-3" },
    { id: "rec-4" },
    { id: "demo-live" },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;
  return <RecordReviewClient id={resolved.id} />;
}
