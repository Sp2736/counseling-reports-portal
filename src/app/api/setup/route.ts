// src/app/api/setup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/src/lib/mongodb";
import { User } from "@/src/models/User";
import { safeEqual } from "@/src/lib/safe-compare";

/**
 * One-time bootstrap of the first admin account.
 *
 * Disabled unless ALL of these are set in the server environment:
 *   SETUP_TOKEN, INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD (12+ chars)
 *
 * Call it once with:  POST /api/setup   header: x-setup-token: <SETUP_TOKEN>
 * It locks itself as soon as any admin exists. Afterwards, remove the three
 * variables from your environment.
 */
export async function POST(req: Request) {
  const token = process.env.SETUP_TOKEN;
  const email = process.env.INITIAL_ADMIN_EMAIL;
  const password = process.env.INITIAL_ADMIN_PASSWORD;

  // Not configured -> behave as if the route does not exist.
  if (!token || !email || !password || password.length < 12) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const provided = req.headers.get("x-setup-token");
  if (!provided || !safeEqual(provided, token)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await connectToDatabase();

    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      return NextResponse.json(
        { error: "Setup locked. An admin account already exists." },
        { status: 403 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "admin",
      isProfileComplete: true,
    });

    // Never echo credentials back.
    return NextResponse.json({
      message:
        "Admin created. Remove SETUP_TOKEN, INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD from the environment now.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}
