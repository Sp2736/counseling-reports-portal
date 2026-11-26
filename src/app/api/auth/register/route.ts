// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/src/lib/mongodb";
import { User } from "@/src/models/User";
import { safeEqual } from "@/src/lib/safe-compare";

// Public sign-up can NEVER create an admin. Admins are created only through the
// one-time setup route or by an existing admin.
const PUBLIC_ROLES = ["student", "counselor"];

export async function POST(req: Request) {
  try {
    const { email, password, role, secretKey } = await req.json();

    if (typeof email !== "string" || typeof password !== "string" || typeof role !== "string") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!PUBLIC_ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Counselor accounts need the authorization key held only in the server environment.
    if (role === "counselor") {
      const expectedKey = process.env.COUNSELOR_SECRET_KEY;

      // Failsafe: if the variable is missing from the server, reject all counselor signups
      if (!expectedKey || typeof secretKey !== "string" || !safeEqual(secretKey, expectedKey)) {
        return NextResponse.json({ error: "Invalid Counselor Authorization Key" }, { status: 403 });
      }
    }

    const sanitizedEmail = email.toLowerCase().trim();

    await connectToDatabase();

    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email: sanitizedEmail,
      password: hashedPassword,
      role,
      isProfileComplete: false
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}