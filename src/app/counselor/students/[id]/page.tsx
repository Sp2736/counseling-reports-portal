import StudentHistoryClient from "./StudentHistoryClient";

export function generateStaticParams() {
  return [
    { id: "stud-live" },
    { id: "stud-1" },
    { id: "stud-2" },
    { id: "stud-3" },
    { id: "stud-4" },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;
  return <StudentHistoryClient id={resolved.id} />;
}
