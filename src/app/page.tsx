import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (!session.user.isProfileComplete) {
    redirect("/onboarding");
  }

  // Direct users to their specific hubs
  if (session.user.role === "admin") redirect("/admin/dashboard");
  if (session.user.role === "counselor") redirect("/counselor/waiting-list");
  if (session.user.role === "student") redirect("/student/upload");

  return null; 
}