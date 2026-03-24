// src/app/api/counselor/stats/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselorProfile } from "@/src/models/CounselorProfile";
import { StudentProfile } from "@/src/models/StudentProfile";
import { CounselingRecord } from "@/src/models/CounselingRecord";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();

    const counselor = await CounselorProfile.findOne({ userId: session.user.id });
    if (!counselor) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const counselorId = counselor._id;

    // 1. Identify Dummy Students to exclude from all statistics
    // (Using regex for case-insensitive matching e.g., "25dcs000" or "25DCS000")
    const dummyProfiles = await StudentProfile.find({
      $or: [
        { studentId: { $regex: /^25dcs000$/i } },
        { fullName: { $regex: /^dummy student$/i } }
      ]
    }).select('_id').lean();
    
    // Extract just the ObjectIds of the dummy accounts
    const dummyIds = dummyProfiles.map(profile => profile._id);

    // 2. Fetch precise counts while strictly EXCLUDING the dummy records
    const totalStudents = await StudentProfile.countDocuments({ 
      assignedCounselor: counselorId,
      _id: { $nin: dummyIds } // Don't count dummy accounts as real students
    });

    const totalReports = await CounselingRecord.countDocuments({ 
      assignedCounselor: counselorId,
      student: { $nin: dummyIds } // Don't count dummy reports in total reviews
    });

    const pendingAI = await CounselingRecord.countDocuments({ 
      assignedCounselor: counselorId, 
      student: { $nin: dummyIds },
      status: "Pending_AI" 
    });

    const needsReview = await CounselingRecord.countDocuments({ 
      assignedCounselor: counselorId, 
      student: { $nin: dummyIds },
      status: "Needs_Review" 
    });

    return NextResponse.json({ 
      totalStudents, 
      totalReports, 
      pendingAI, 
      needsReview 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Fetch Counselor Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}