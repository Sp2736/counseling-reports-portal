import NextAuth, { DefaultSession } from "next-auth";

// This merges our custom properties with the default NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isProfileComplete: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    isProfileComplete: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    isProfileComplete: boolean;
  }
}