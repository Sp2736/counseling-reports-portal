import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/src/lib/mongodb";
import { User } from "@/src/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@university.edu" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await connectToDatabase();

        // Find the user and explicitly select the password field (since we hid it in the schema)
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) {
          throw new Error("No user found with this email");
        }

        // SECURITY: Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // Return the user object without the password
        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          isProfileComplete: user.isProfileComplete,
        };
      }
    })
  ],
  callbacks: {
    // 1. When a JWT is created or updated
    async jwt({ token, user, trigger, session }) {
      // NEW FIX: Listen for the client requesting a cookie update
      if (trigger === "update" && session?.isProfileComplete) {
        token.isProfileComplete = session.isProfileComplete;
      }
      
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isProfileComplete = user.isProfileComplete;
      }
      return token;
    },
    // 2. When the frontend requests the session
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isProfileComplete = token.isProfileComplete as boolean;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours until the session expires
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // We will build this custom login page next
  },
};

const handler = NextAuth(authOptions);

// Next.js requires these to be exported as GET and POST for the App Router
export { handler as GET, handler as POST };