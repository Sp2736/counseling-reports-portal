// src/app/api/dev/seed/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "../../../../lib/mongodb"; // Use relative path if @/ fails
import { User } from "../../../../models/User";

export async function GET() {
  try {
    await connectToDatabase();

    // Use a standard password for both test accounts
    const hashedPassword = await bcrypt.hash("Password@123", 10);

    // 1. Create a Test Counselor (upsert means it updates if it exists, creates if it doesn't)
    await User.findOneAndUpdate(
      { email: "counselor@university.edu" },
      { 
        email: "counselor@university.edu", 
        password: hashedPassword, 
        role: "counselor", 
        isProfileComplete: false // We want them to go through onboarding!
      },
      { upsert: true, new: true }
    );

    // 2. Create a Test Student
    await User.findOneAndUpdate(
      { email: "student@university.edu" },
      { 
        email: "student@university.edu", 
        password: hashedPassword, 
        role: "student", 
        isProfileComplete: false // We want them to go through onboarding!
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: "Test accounts created successfully!",
      accounts: [
        { role: "Counselor", email: "counselor@university.edu", password: "Password@123" },
        { role: "Student", email: "student@university.edu", password: "Password@123" }
      ]
    }, { status: 200 });

  } catch (error) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}