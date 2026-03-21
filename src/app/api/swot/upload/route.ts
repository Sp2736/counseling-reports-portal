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

    const isDocx = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx");
    if (!isDocx) {
      return NextResponse.json({ error: "Invalid file type. Please upload a .docx file." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await mammoth.extractRawText({ buffer });
    const rawText = result.value;

    if (!rawText || rawText.trim() === "") {
      return NextResponse.json({ error: "The document appears to be empty or unreadable." }, { status: 400 });
    }

    // --- SMART EXTRACTOR ---
    const semesterMatch = rawText.match(/Semester\s*[,:-]?\s*(\d+)/i);
    const extractedSemester = semesterMatch ? parseInt(semesterMatch[1], 10) : null;

    if (extractedSemester) {
      await StudentProfile.findOneAndUpdate(
        { userId: session.user.id },
        { $set: { semester: extractedSemester } }
      );
    }

    const aiResult = await analyzeSWOTWithAI(rawText);

    const newRecord = await CounselingRecord.create({
      student: studentProfile._id,
      assignedCounselor: studentProfile.assignedCounselor,
      status: "Needs_Review", 
      original_submitted_text: rawText, 
      swot_input: aiResult.swot_input,
      ai_analysis: aiResult.ai_analysis,
    });

    return NextResponse.json({ message: "Analysis Complete!", recordId: newRecord._id }, { status: 200 });

  } catch (error: any) {
    console.error("Document Processing Error:", error);
    return NextResponse.json({ error: "An error occurred while processing your document. Please try again." }, { status: 500 });
  }
}