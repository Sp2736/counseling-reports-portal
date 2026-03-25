// src/app/api/counselor/records/[id]/analyze/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselingRecord } from "@/src/models/CounselingRecord";
import { analyzeSWOTWithAI } from "@/src/lib/ai-service";
import mongoose from "mongoose";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid record identifier." }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "counselor") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectToDatabase();
    const record = await CounselingRecord.findById(id);
    if (!record) return NextResponse.json({ error: "Record not found" }, { status: 404 });

    if (record.ai_analysis && record.ai_analysis.risk_prediction) {
       return NextResponse.json({ message: "Already analyzed", ai_analysis: record.ai_analysis }, { status: 200 });
    }

    // --- CRITICAL FIX: BACKWARDS COMPATIBILITY ---
    // If it's an old report missing the raw text, reconstruct it from the SWOT arrays!
    let textToAnalyze = record.original_submitted_text;

    if (!textToAnalyze && record.swot_input) {
      const { strengths, weaknesses, opportunities, threats } = record.swot_input;
      textToAnalyze = `
        Strengths: ${strengths?.join(", ") || "None"}
        Weaknesses: ${weaknesses?.join(", ") || "None"}
        Opportunities: ${opportunities?.join(", ") || "None"}
        Threats: ${threats?.join(", ") || "None"}
      `.trim();
    }

    if (!textToAnalyze || textToAnalyze.trim() === "") {
      return NextResponse.json({ error: "No raw text available to analyze." }, { status: 400 });
    }
    // ----------------------------------------------

    // 1. Call the AI
    const aiResult = await analyzeSWOTWithAI(textToAnalyze);

    // 2. Force the update into MongoDB
    await CounselingRecord.findByIdAndUpdate(
      id, 
      { $set: { ai_analysis: aiResult.ai_analysis } }, 
      { new: true, strict: false } 
    );

    // 3. Guarantee the frontend receives the raw AI object immediately
    return NextResponse.json({ 
      message: "Analysis generated successfully", 
      ai_analysis: aiResult.ai_analysis 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Manual AI Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate AI insights." }, { status: 500 });
  }
}