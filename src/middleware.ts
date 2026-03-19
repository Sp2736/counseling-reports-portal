import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. If the user is logged in but hasn't completed their profile, trap them in the onboarding flow
    if (token && !token.isProfileComplete && path !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // 2. Role-Based Route Protection
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (path.startsWith("/counselor") && token?.role !== "counselor") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (path.startsWith("/student") && token?.role !== "student") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // This ensures the middleware ONLY fires if there is a token (unless the route is completely public)
      authorized: ({ token }) => !!token,
    },
  }
);

// This config block tells Next.js exactly which routes the middleware should protect.
// We protect admin, counselor, student, and onboarding routes.
export const config = {
  matcher: ["/admin/:path*", "/counselor/:path*", "/student/:path*", "/onboarding"],
};