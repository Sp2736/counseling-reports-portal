// src/app/counselor/layout.tsx
import CounselorNavbar from "@/src/app/components/CounselorNavbar";

export default function CounselorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CounselorNavbar />
      <main>{children}</main>
    </>
  );
}