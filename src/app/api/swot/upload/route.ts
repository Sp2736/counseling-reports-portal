// src/app/api/swot/upload/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { StudentProfile } from "@/src/models/StudentProfile";
import { CounselingRecord } from "@/src/models/CounselingRecord";
import { analyzeSWOTWithAI } from "@/src/lib/ai-service";
import mammoth from "mammoth";

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

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
    }

    // Explicitly reject anything that isn't a DOCX
    const isDocx = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx");
    if (!isDocx) {
      return NextResponse.json({ error: "Invalid file type. Please upload a .docx file." }, { status: 400 });
    }

    // 1. Convert the uploaded file into a Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Extract pure text using Mammoth
    const result = await mammoth.extractRawText({ buffer });
    const rawText = result.value;

    if (!rawText || rawText.trim() === "") {
      return NextResponse.json({ error: "The document appears to be empty or unreadable." }, { status: 400 });
    }

    // 3. Send the clean text string directly to Gemini
    const aiResult = await analyzeSWOTWithAI(rawText);

    // 4. Calculate dynamic report period (1 through 4)
    const lastRecord = await CounselingRecord.findOne({ student: studentProfile._id }).sort({ createdAt: -1 });
    let currentPeriod = 1;
    if (lastRecord && lastRecord.report_period) {
       currentPeriod = lastRecord.report_period < 4 ? lastRecord.report_period + 1 : 1;
    }

    // 5. Save the AI's output AND the raw text to the database
    const newRecord = await CounselingRecord.create({
      student: studentProfile._id,
      assignedCounselor: studentProfile.assignedCounselor,
      status: "Needs_Review", 
      report_period: currentPeriod,
      original_submitted_text: rawText, // Ensures the counselor can see the student's actual words
      swot_input: aiResult.swot_input,
      ai_analysis: aiResult.ai_analysis,
    });

    return NextResponse.json({ message: "Analysis Complete!", recordId: newRecord._id }, { status: 200 });

  } catch (error: any) {
    // Keep the detailed error in the server console for the developer
    console.error("Document Processing Error:", error);
    
    // Return a clean, sanitized message to the student
    return NextResponse.json({ error: "An error occurred while processing your document. Please try again." }, { status: 500 });
  }
}