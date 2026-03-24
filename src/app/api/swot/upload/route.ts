// src/app/api/swot/upload/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { StudentProfile } from "@/src/models/StudentProfile";
import { CounselingRecord } from "@/src/models/CounselingRecord";
import { analyzeSWOTWithAI } from "@/src/lib/ai-service";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    await connectToDatabase();

    const studentProfile = await StudentProfile.findOne({ userId: session.user.id });
    if (!studentProfile) {
      return NextResponse.json({ error: "Student profile not found." }, { status: 404 });
    }

    // Parse the incoming JSON payload instead of FormData
    const body = await req.json();
    const { semester, strengths, weaknesses, opportunities, threats } = body;

    // Validate inputs
    if (!strengths || !weaknesses || !opportunities || !threats) {
      return NextResponse.json({ error: "Please complete all SWOT sections before submitting." }, { status: 400 });
    }

    // Update the student's semester if provided
    if (semester) {
      const parsedSemester = parseInt(semester, 10);
      if (!isNaN(parsedSemester)) {
        await StudentProfile.findOneAndUpdate(
          { userId: session.user.id },
          { $set: { semester: parsedSemester } }
        );
      }
    }

    // Reconstruct a raw text document format so the existing AI prompt functions without modification
    const rawText = `
Semester: ${semester || "Not specified"}

Strengths:
${strengths}

Weaknesses:
${weaknesses}

Opportunities:
${opportunities}

Threats:
${threats}
    `.trim();

    // Call the AI service with the constructed text
    const aiResult = await analyzeSWOTWithAI(rawText);

    // Helper function to convert text area input (lines) into an array of strings for MongoDB
    const splitIntoArray = (text: string) => {
      return text
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    };

    // Create the new record matching the Mongoose schema requirements
    const newRecord = await CounselingRecord.create({
      student: studentProfile._id,
      assignedCounselor: studentProfile.assignedCounselor,
      status: "Needs_Review", 
      original_submitted_text: rawText, 
      swot_input: {
        strengths: splitIntoArray(strengths),
        weaknesses: splitIntoArray(weaknesses),
        opportunities: splitIntoArray(opportunities),
        threats: splitIntoArray(threats),
      },
      ai_analysis: aiResult.ai_analysis,
    });

    return NextResponse.json({ message: "Analysis Complete!", recordId: newRecord._id }, { status: 200 });

  } catch (error: any) {
    console.error("Data Processing Error:", error);
    return NextResponse.json({ error: "An error occurred while processing your submission. Please try again." }, { status: 500 });
  }
}