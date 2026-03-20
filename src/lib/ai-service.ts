// src/lib/ai-service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeSWOTWithAI(text: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing Gemini API Key. Please check your .env.local file.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert academic counselor and psychologist.
    Analyze the following student text (which may be a SWOT analysis or general thoughts).
    Extract and structure the data into the following JSON format strictly. Do not add markdown formatting, just the raw JSON.

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
    jsonString = jsonString.replace(/```json/gi, "").replace(/```/g, "").trim();

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