// src/app/api/setup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/src/lib/mongodb";
import { User } from "@/src/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    // SECURITY: Check if ANY admin already exists. If yes, completely disable this route.
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      return NextResponse.json(
        { error: "Setup locked. An admin account already exists." },
        { status: 403 }
      );
    }

    // Hash the default password (you can change this password after logging in later)
    const hashedPassword = await bcrypt.hash("Admin@1234", 10);

    // Create the Master Admin
    const admin = await User.create({
      email: "admin@university.edu",
      password: hashedPassword,
      role: "admin",
      isProfileComplete: true, // Admins don't need to go through student onboarding
    });

    return NextResponse.json({
      message: "Master Admin created successfully. You can now log in.",
      email: "admin@university.edu",
      password: "Admin@1234",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}