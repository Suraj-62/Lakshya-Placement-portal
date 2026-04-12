import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  try {
    console.log("Checking API Key:", process.env.GEMINI_API_KEY ? "Found" : "Missing");
    console.log("Starting generation with model 'gemini-1.5-flash'...");
    
    // Using the exact syntax from adminController.js
    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'Say "Connection successful" in JSON: {"status": "ok"}'
    });
    
    console.log("Raw Result Type:", typeof result);
    console.log("Text property type:", typeof result.text);
    console.log("Text content:", result.text);

  } catch (err) {
    console.error("DEBUG AI ERROR:", err.message);
    if (err.stack) console.error(err.stack);
  }
}

test();
