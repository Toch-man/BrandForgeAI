import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config.js";

if (!config.geminiApiKey) {
  throw new Error("GEMINI_API_KEY is missing in your .env");
}

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

export const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite",
});

export async function generateJSON(prompt) {
  const result = await model.generateContent(`
You are an expert social media strategist.

Always respond with VALID JSON only.
Do not wrap your response inside markdown.
Do not explain anything.

${prompt}
`);

  const text = result.response.text();

  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function generateText(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}
