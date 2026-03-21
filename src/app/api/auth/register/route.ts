// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/src/lib/mongodb";
import { User } from "@/src/models/User";

export async function POST(req: Request) {
  try {
    const { email, password, role, secretKey } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // THE FIX: Strictly compare against the hidden environment variable
    if (role === "counselor") {
      const expectedKey = process.env.COUNSELOR_SECRET_KEY;
      
      // Failsafe: If the env variable is missing from the server, reject all counselor signups
      if (!expectedKey || secretKey !== expectedKey) {
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