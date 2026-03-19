// src/app/api/admin/users/create/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
// Remember to use relative paths (e.g., ../../../../../lib/mongodb) if the @/ alias acts up again!
import connectToDatabase from "@/src/lib/mongodb";
import { User } from "@/src/models/User";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    // 1. THE BOUNCER: Strictly verify the requester is logged in AND is an admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const { email, password, role } = await req.json();

    // 2. Data Validation
    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    
    if (!["student", "counselor", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role selected." }, { status: 400 });
    }

    await connectToDatabase();

    // 3. Prevent Duplicates
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }

    // 4. Secure the Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create the User
    // Admins bypass onboarding. Students and Counselors are forced to complete their profiles.
    const isProfileComplete = role === "admin";

    await User.create({
      email,
      password: hashedPassword,
      role,
      isProfileComplete,
    });

    return NextResponse.json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully.` }, { status: 201 });

  } catch (error) {
    console.error("User Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}