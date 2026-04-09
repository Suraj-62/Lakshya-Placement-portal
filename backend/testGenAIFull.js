import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    const categoryName = "Data Structures";
    const count = 3;
    const prompt = `
Generate ${count} company-level placement questions (multiple choice) for the technical category: ${categoryName}. 
The difficulty should be appropriate for FAANG and top tech companies interviews (mix of medium and hard).
Output raw JSON ONLY. No markdown blocks, no formatting wrapper. It must be an array of objects perfectly stringifiable.
JSON Array Format expected:
[
  {
    "questionText": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option B",
    "explanation": "Why this is correct.",
    "difficulty": "medium",
    "topic": "Specific sub-topic"
  }
]
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-pro-latest',
      contents: prompt
    });

    let rawText = result.text.trim();
    console.log("Raw output before slice:", rawText);
    
    if (rawText.startsWith('\`\`\`json')) rawText = rawText.slice(7);
    if (rawText.startsWith('\`\`\`')) rawText = rawText.slice(3);
    if (rawText.endsWith('\`\`\`')) rawText = rawText.slice(0, -3);
    rawText = rawText.trim();
    console.log("\nAfter slice:", rawText);

    const qs = JSON.parse(rawText);
    console.log("Parsed exactly:", qs.length);
  } catch (e) {
    console.error("ERROR GENERATING:", e);
  }
}

run();
