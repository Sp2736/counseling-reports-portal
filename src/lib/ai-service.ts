// src/lib/ai-service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Missing GEMINI_API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export async function analyzeSWOTWithAI(rawText: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const systemPrompt = `
    You are an AI academic counseling assistant used by a university.
    Your task is to analyze the attached student's SWOT analysis text and generate a counseling report.

    Analyze the SWOT inputs carefully.
    Infer psychological and behavioral signals.
    Predict an academic risk score (0-100) and risk level (Low, Medium, High).
    Return the output STRICTLY in the following JSON schema:
    {
      "swot_input": {
        "strengths": ["string"],
        "weaknesses": ["string"],
        "opportunities": ["string"],
        "threats": ["string"]
      },
      "ai_analysis": {
        "psychological_profile": {
          "dominant_traits": ["string"],
          "learning_style": "string",
          "motivation_level": "string",
          "psychological_growth_category": "Self-driven learner" | "Balanced performer" | "Struggling but motivated" | "High-risk academic stress"
        },
        "risk_prediction": {
          "risk_score": 0,
          "risk_level": "Low" | "Medium" | "High",
          "risk_factors": ["string"]
        },
        "career_insights": {
          "detected_interests": ["string"],
          "potential_career_paths": ["string"]
        },
        "generated_report": {
          "counselor_findings": "string",
          "recommended_action_plan": "string",
          "priority_interventions": ["string"]
        }
      }
    }
  `;

  const prompt = `${systemPrompt}\n\nHere is the raw text extracted from the student's SWOT document:\n"""\n${rawText}\n"""`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonString = response.text();

    // THE FIX: Strip out the markdown code block markers that Gemini sometimes adds
    jsonString = jsonString
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(jsonString);
    } catch (parseError) {
      // If it still fails, log the exact string so we can see what Gemini messed up
      console.error("Failed to parse the cleaned JSON:", jsonString);
      throw new Error("AI returned malformed data.");
    }
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate AI report from the provided text.");
  }
}
