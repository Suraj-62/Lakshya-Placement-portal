import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    for await (const m of await ai.models.list()) {
      console.log(m.name);
    }
  } catch(e) {
    console.log(e);
  }
}
run();
