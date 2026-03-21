// src/lib/ai-service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeSWOTWithAI(text: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "Missing Gemini API Key. Please check your .env.local file.",
    );
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert university academic counselor analyzing a student's self-assessment document. Analyze the following text. Respond strictly with a JSON object.

  CRITICAL FORMATTING INSTRUCTIONS:
  For the generated_report section, you MUST adhere to these strict length constraints:
  1. "counselor_findings": Return a single string containing EXACTLY 3 to 5 concise bullet points. Start each bullet with "- " and separate them with newlines. DO NOT write paragraphs.
  2. "priority_interventions": Return an array of strings containing EXACTLY 3 to 5 concise, actionable items.

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
          "psychological_growth_category": "string"
        },
        "risk_prediction": {
          "risk_score": 5,
          "risk_level": "Medium",
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

    Student Text:
    """
    ${text}
    """
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonString = response.text();

    // Sanitize the output: Strip out markdown code block markers if Gemini adds them
    jsonString = jsonString
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse the cleaned JSON:", jsonString);
      throw new Error("AI returned malformed data.");
    }
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate AI report from the provided text.");
  }
}
