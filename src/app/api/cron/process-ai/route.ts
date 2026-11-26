// src/app/api/cron/process-ai/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/src/lib/mongodb";
import { CounselingRecord } from "@/src/models/CounselingRecord";
import { analyzeSWOTWithAI } from "@/src/lib/ai-service";
import { safeEqual } from "@/src/lib/safe-compare";

// Rebuild the analysis text from the structured SWOT arrays when the raw text is absent.
function buildTextFromSwot(record: any): string {
  const s = record.swot_input || {};
  return [
    `Strengths: ${(s.strengths || []).join(", ") || "None"}`,
    `Weaknesses: ${(s.weaknesses || []).join(", ") || "None"}`,
    `Opportunities: ${(s.opportunities || []).join(", ") || "None"}`,
    `Threats: ${(s.threats || []).join(", ") || "None"}`,
  ].join("\n");
}

// Delay helper: Wait 5 seconds between AI calls to respect the 15 RPM Gemini limit
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Optional: Vercel config to allow this script to run longer than the default 10 seconds
export const maxDuration = 60; 

export async function GET(req: Request) {
  // Security check: Ensure only your cron job can trigger this, not random users
  // Fail closed: if CRON_SECRET is not configured, nobody can trigger this endpoint.
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization') ?? '';
  if (!secret || !safeEqual(authHeader, `Bearer ${secret}`)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // Fetch up to 10 students who are waiting for AI processing
    // 10 students * 2 times an hour = 20 students an hour. 
    // This easily handles your 100 students/day requirement without breaking anything.
    const pendingRecords = await CounselingRecord.find({ status: "Pending_AI" }).limit(10);

    if (pendingRecords.length === 0) {
      console.log("Cron ran: No pending records found.");
      return NextResponse.json({ message: "No pending records to process." }, { status: 200 });
    }

    let processedCount = 0;

    for (const record of pendingRecords) {
      try {
        const rawText = record.original_submitted_text || buildTextFromSwot(record);
        
        // 1. Send data to Gemini
        const aiResult = await analyzeSWOTWithAI(rawText);

        // 2. Save the AI output back to MongoDB and update status
        await CounselingRecord.findByIdAndUpdate(record._id, {
          ai_analysis: aiResult.ai_analysis,
          status: "Needs_Review"
        });

        processedCount++;
        console.log(`Successfully processed record: ${record._id}`);

        // 3. Pause for 5 seconds before the next student to avoid 429 Rate Limits
        if (processedCount < pendingRecords.length) {
            await delay(5000); 
        }

      } catch (err) {
        console.error(`Failed to process record ${record._id}:`, err);
        // We leave the status as Pending_AI so it will automatically try again on the next 30-minute run
      }
    }

    return NextResponse.json({ 
      message: `Cron Success: Processed ${processedCount} records.` 
    }, { status: 200 });

  } catch (error) {
    console.error("Cron Processing Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}