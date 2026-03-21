// src/app/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // 1. If not logged in, send to login
  if (!session) {
    redirect("/login");
  }

  // 2. If profile is incomplete, force them to onboarding
  if (!session.user?.isProfileComplete) {
    redirect("/onboarding");
  }

  // 3. Role-based routing (The Traffic Cop)
  if (session.user.role === "admin") {
    redirect("/admin/dashboard");
  } else if (session.user.role === "counselor") {
    redirect("/counselor/waiting-list");
  } else if (session.user.role === "student") {
    // THE FIX: Send students to the dashboard instead of /student/upload
    redirect("/student/dashboard"); 
  }

  // Fallback just in case
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to your portal...</p>
    </div>
  );
}