// src/app/api/user/complete-profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { User } from "@/src/models/User";
import { StudentProfile } from "@/src/models/StudentProfile";
import { CounselorProfile } from "@/src/models/CounselorProfile";

export async function POST(req: Request) {
  try {
    // SECURITY: Ensure the user is actually logged in before accepting data
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, identifier, counselorId } = body;
    const role = session.user.role;

    if (!fullName || !identifier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    if (role === "student") {
      if (!counselorId) {
        return NextResponse.json({ error: "You must select a counselor" }, { status: 400 });
      }

      // Auto-extract year and department from "23CSE102"
      const admissionYear = "20" + identifier.substring(0, 2); // "2023"
      const department = identifier.substring(2, 5).toUpperCase(); // "CSE"

      await StudentProfile.create({
        userId: session.user.id,
        fullName,
        studentId: identifier.toUpperCase(),
        assignedCounselor: counselorId,
        admissionYear,
        department,
      });

    } else if (role === "counselor") {
      await CounselorProfile.create({
        userId: session.user.id,
        fullName,
        employeeId: identifier,
        // The managed ranges (e.g., 23CSE001 to 23CSE060) can be configured by the Admin later
      });
    }

    // Finally, update the User model to unlock the rest of the application
    await User.findByIdAndUpdate(session.user.id, { isProfileComplete: true });

    return NextResponse.json({ message: "Profile completed successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Profile Completion Error:", error);
    // Handle MongoDB unique constraint errors (e.g., ID already exists)
    if (error.code === 11000) {
      return NextResponse.json({ error: "This ID is already registered in the system." }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}