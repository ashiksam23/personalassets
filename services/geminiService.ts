import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeminiMandalaResponse } from '../types';

const apiKey = process.env.API_KEY || '';

// Initialize AI client only if key exists to prevent immediate crash on load,
// but validation happens during function call.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const mandalaSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    subGoals: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Exactly 8 sub-goals related to the main goal."
    },
    tasks: {
      type: Type.ARRAY,
      items: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Exactly 8 tasks for a specific sub-goal."
      },
      description: "Array of 8 arrays, where each inner array contains 8 tasks corresponding to the sub-goals in order."
    }
  },
  required: ["subGoals", "tasks"]
};

export const generateMandalaContent = async (mainGoal: string): Promise<GeminiMandalaResponse> => {
  if (!apiKey || !ai) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const prompt = `
    I need to create a Mandala Chart (Harada Method) for the following Main Goal: "${mainGoal}".
    
    A Mandala Chart consists of:
    1. The Main Goal in the center.
    2. 8 Sub-goals surrounding the main goal.
    3. 8 Tasks/Actions for EACH of the 8 Sub-goals.
    
    Please generate:
    - 8 distinct Sub-goals related to achieving "${mainGoal}".
    - For each Sub-goal, generate 8 specific, actionable tasks (short phrases, max 3-4 words).
    
    Ensure the output is strict JSON following the schema.
    The 'subGoals' array must have exactly 8 strings.
    The 'tasks' array must have exactly 8 arrays, each containing exactly 8 strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: mandalaSchema,
        systemInstruction: "You are an expert productivity coach specializing in the Mandala Chart technique.",
        temperature: 0.7
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as GeminiMandalaResponse;
    
    // Basic validation
    if (data.subGoals?.length !== 8 || data.tasks?.length !== 8) {
      throw new Error("AI response format was incorrect (wrong lengths).");
    }

    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};