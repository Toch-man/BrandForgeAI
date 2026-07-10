import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "./config.js";

if (!config.geminiApiKey) {
  throw new Error("GEMINI_API_KEY is missing from .env");
}

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function askGemini(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (err) {
    console.error("Gemini Error:", err);
    throw err;
  }
}

export default model;
