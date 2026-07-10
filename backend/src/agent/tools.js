import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { generateJSON } from "./gemini.js";

/* -------------------------------------------------------------------------- */
/* AI Caption Generator                                                       */
/* -------------------------------------------------------------------------- */

export const generateCaptionTool = new DynamicStructuredTool({
  name: "generate_caption",

  description: "Generate engaging captions for any social media platform.",

  schema: z.object({
    topic: z.string(),
    platform: z.string(),
    tone: z.string().default("Professional"),
  }),

  func: async ({ topic, platform, tone }) => {
    return await generateJSON(`
Create an engaging ${platform} caption.

Topic:
${topic}

Tone:
${tone}

Return JSON

{
  "caption":"",
  "cta":"",
  "emoji":""
}
`);
  },
});

/* -------------------------------------------------------------------------- */
/* AI Hashtag Generator                                                       */
/* -------------------------------------------------------------------------- */

export const generateHashtagsTool = new DynamicStructuredTool({
  name: "generate_hashtags",

  description: "Generate trending hashtags.",

  schema: z.object({
    topic: z.string(),
    platform: z.string(),
  }),

  func: async ({ topic, platform }) => {
    return await generateJSON(`
Generate 15 highly relevant hashtags.

Platform:
${platform}

Topic:
${topic}

Return JSON

{
  "hashtags":[]
}
`);
  },
});

/* -------------------------------------------------------------------------- */
/* AI Content Ideas                                                           */
/* -------------------------------------------------------------------------- */

export const generateContentIdeasTool = new DynamicStructuredTool({
  name: "generate_content_ideas",

  description: "Generate viral content ideas.",

  schema: z.object({
    niche: z.string(),
  }),

  func: async ({ niche }) => {
    return await generateJSON(`
Generate 10 viral social media content ideas.

Niche:
${niche}

Return JSON

{
 "ideas":[]
}
`);
  },
});

/* -------------------------------------------------------------------------- */
/* AI Content Calendar                                                        */
/* -------------------------------------------------------------------------- */

export const generateContentCalendarTool = new DynamicStructuredTool({
  name: "generate_content_calendar",

  description: "Generate a 7-day content calendar.",

  schema: z.object({
    niche: z.string(),
    platform: z.string(),
  }),

  func: async ({ niche, platform }) => {
    return await generateJSON(`
Create a 7-day content calendar.

Platform:
${platform}

Niche:
${niche}

Return JSON

{
 "days":[
   {
     "day":"",
     "topic":"",
     "caption":"",
     "cta":""
   }
 ]
}
`);
  },
});

export const tools = [
  generateCaptionTool,
  generateHashtagsTool,
  generateContentIdeasTool,
  generateContentCalendarTool,
];
