import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function check() {
  try {
    const list = await ai.models.list();
    if (list && list.models) {
        const names = list.models.map(m => m.name);
        console.log("ALL MODELS:", names.join(', '));
    }
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

await check();
