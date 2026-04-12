import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from '@google/genai';

async function main() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'hi'
    });
    console.log('SUCCESS:', response.text);
  } catch (e) {
    console.log('ERROR:', e.message);
  }
}
main();
