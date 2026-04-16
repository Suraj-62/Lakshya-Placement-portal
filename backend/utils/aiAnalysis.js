import { GoogleGenAI } from '@google/genai';

/**
 * AI performance judge using Gemini.
 * Returns a structured JSON for high-fidelity UI rendering.
 */
export const judgePerformance = async (perfData) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
Act as a professional technical career mentor. 
Analyze the student's performance data: ${JSON.stringify(perfData)}

Return exactly a JSON object in this format:
{
  "strength": "One powerful sentence about their best technical trait.",
  "objective": "One specific technical area or topic they must master next.",
  "level": "A one-word technical title (e.g. Apprentice, Architect, Visionary, Specialist)"
}

Keep descriptions under 15 words each. DO NOT include markdown formatting.
`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const responseText = result.text.trim();
    return JSON.parse(responseText);
    
  } catch (error) {
    console.error("AI Judge Error:", error);
    return {
      strength: "Currently establishing baseline performance benchmarks.",
      objective: "Complete more assessments to generate diagnostic data.",
      level: "Awaiting Data"
    };
  }
};
