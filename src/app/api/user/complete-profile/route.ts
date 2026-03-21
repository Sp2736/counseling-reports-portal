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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    await connectToDatabase();

    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.role === "student") {
      // 1. Extract the raw letters (e.g., "DCS")
      const deptMatch = data.studentId.match(/[a-zA-Z]+/);
      const rawDept = deptMatch ? deptMatch[0].toUpperCase() : "UNKNOWN";

      // 2. THE DICTIONARY: Map the raw ID letters to the Display Department
      const departmentMapping: Record<string, string> = {
        "DCS": "CSE",
        "DCE": "CE",
        "DIT": "IT"
      };

      // 3. Translate it! (If they type something weird, it just uses what they typed)
      const finalDepartment = departmentMapping[rawDept] || rawDept;

      await StudentProfile.findOneAndUpdate(
        { userId: user._id },
        { 
          $set: {
            fullName: data.fullName,
            studentId: data.studentId.toUpperCase(),
            department: finalDepartment, // Saves as CSE, CE, or IT
            semester: 1,
            assignedCounselor: data.assignedCounselor
          }
        },
        { upsert: true, returnDocument: 'after' } 
      );
      
    } else if (user.role === "counselor") {
      const combinedName = `${data.title} ${data.fullName}`.trim();
      
      await CounselorProfile.findOneAndUpdate(
        { userId: user._id },
        {
          $set: {
            employeeId: data.employeeId, // NEW: Save Employee ID
            fullName: combinedName,
            department: data.department, // Saves the dropdown value (CSE, CE, IT)
            batchYear: data.batchYear,
            startRollNo: data.startRollNo,
            endRollNo: data.endRollNo
          }
        },
        { upsert: true, returnDocument: 'after' } 
      );
    }

    user.isProfileComplete = true;
    await user.save();

    return NextResponse.json({ message: "Profile completed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Profile Completion Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}