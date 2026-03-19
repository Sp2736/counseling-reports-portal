// src/app/student/layout.tsx
import StudentNavbar from "@/src/app/components/StudentNavbar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StudentNavbar />
      <main>{children}</main>
    </>
  );
}