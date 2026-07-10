import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config.js";

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function handleTask(event) {
  try {
    // SDK usually includes the negotiation requirements in the event/raw payload.
    const raw = event.raw || {};

    let requirements = raw.requirements || "{}";

    if (typeof requirements === "string") {
      try {
        requirements = JSON.parse(requirements);
      } catch {
        requirements = {};
      }
    }

    const service = raw.service_name || raw.service || requirements.service;

    switch (service) {
      case "caption-generator":
        return await generateCaption(requirements);

      case "hashtag-generator":
        return await generateHashtags(requirements);

      case "content-ideas":
        return await generateIdeas(requirements);

      case "content-calendar":
        return await generateCalendar(requirements);

      default:
        return {
          success: false,
          error: "Unknown service",
        };
    }
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: err.message,
    };
  }
}

async function askGemini(prompt) {
  const result = await model.generateContent(prompt);

  return result.response.text();
}

async function generateCaption(data) {
  const prompt = `
Generate an engaging social media caption.

Platform:
${data.platform || "Instagram"}

Topic:
${data.topic || ""}

Tone:
${data.tone || "Professional"}

Audience:
${data.audience || "General"}

Only return the caption.
`;

  const caption = await askGemini(prompt);

  return {
    success: true,
    service: "caption-generator",
    caption,
  };
}

async function generateHashtags(data) {
  const prompt = `
Generate ${data.count || 15} highly relevant hashtags.

Topic:
${data.topic}

Platform:
${data.platform}

Return only hashtags.
`;

  const hashtags = await askGemini(prompt);

  return {
    success: true,
    service: "hashtag-generator",
    hashtags,
  };
}

async function generateIdeas(data) {
  const prompt = `
Generate 10 viral content ideas.

Niche:
${data.niche}

Audience:
${data.audience || "General"}

Platform:
${data.platform || "Instagram"}

Return as a numbered list.
`;

  const ideas = await askGemini(prompt);

  return {
    success: true,
    service: "content-ideas",
    ideas,
  };
}

async function generateCalendar(data) {
  const prompt = `
Create a 7-day content calendar.

Niche:
${data.niche}

Platform:
${data.platform || "Instagram"}

Return Day 1 to Day 7 with:

- Topic
- Caption Idea
- CTA
`;

  const calendar = await askGemini(prompt);

  return {
    success: true,
    service: "content-calendar",
    calendar,
  };
}
