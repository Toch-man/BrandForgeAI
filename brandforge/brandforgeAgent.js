// src/routes/brandforgeAgent.js
// Add these 4 routes to your existing Express app in src/index.js:
//   import brandforgeRouter from './routes/brandforgeAgent.js';
//   app.use('/agent', brandforgeRouter);
//
// These sit alongside your existing /agent/run route — no conflict.

import { Router } from 'express';
import { generateText } from '../services/gemini.js';

const router = Router();

function stripJson(t) {
  return t.replace(/```json\s*|\s*```/g, '').trim();
}

// POST /agent/caption
router.post('/caption', async (req, res) => {
  try {
    const { topic, platform } = req.body;
    if (!topic || !platform) return res.status(400).json({ error: 'topic and platform are required' });

    const rules = {
      Twitter:   'Max 240 characters. Punchy, no fluff, 1-2 hashtags.',
      Facebook:  '100-200 words. Conversational, end with a question to drive comments.',
      LinkedIn:  'Professional tone. Start with a hook. 150-300 words. Add insights.',
      Instagram: 'Engaging, emojis welcome, 3-5 hashtags at end. 50-150 words.',
    };

    const prompt = `Write a ${platform} caption about: "${topic}"
Rules: ${rules[platform] || 'Platform-appropriate tone and length.'}
Return ONLY the caption text, nothing else.`;

    const result = await generateText(prompt);
    res.json(result.trim());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /agent/hashtags
router.post('/hashtags', async (req, res) => {
  try {
    const { topic, platform } = req.body;
    if (!topic || !platform) return res.status(400).json({ error: 'topic and platform are required' });

    const prompt = `Generate 15 optimized hashtags for ${platform} about: "${topic}"
Rules:
- Mix popular (1M+ posts) and niche (10K-100K posts) hashtags
- Relevant to the topic
- No # symbol, just the words
Return ONLY a JSON array of strings. Example: ["hashtag1", "hashtag2"]
No markdown, no explanation.`;

    const raw = await generateText(prompt);
    const cleaned = stripJson(raw);
    try {
      res.json(JSON.parse(cleaned));
    } catch {
      // If JSON parse fails, split by lines/commas
      const hashtags = cleaned
        .replace(/[\[\]"]/g, '')
        .split(/[,\n]/)
        .map(h => h.trim().replace(/^#/, ''))
        .filter(Boolean);
      res.json(hashtags);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /agent/ad-copy
router.post('/ad-copy', async (req, res) => {
  try {
    const { product, platform } = req.body;
    if (!product || !platform) return res.status(400).json({ error: 'product and platform are required' });

    const prompt = `Write high-converting ad copy for "${product}" to run on ${platform}.
Return ONLY a JSON object with exactly these keys:
{
  "headline": "attention-grabbing headline under 40 chars",
  "primary_text": "compelling body text 50-150 words that sells the product",
  "cta": "strong call to action button text (e.g. Shop Now, Learn More)"
}
No markdown, no explanation, just the JSON.`;

    const raw = await generateText(prompt);
    const cleaned = stripJson(raw);
    try {
      res.json(JSON.parse(cleaned));
    } catch {
      res.json({ headline: '', primary_text: cleaned, cta: 'Learn More' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /agent/content-ideas
router.post('/content-ideas', async (req, res) => {
  try {
    const { niche } = req.body;
    if (!niche) return res.status(400).json({ error: 'niche is required' });

    const prompt = `Generate exactly 10 creative, engaging content ideas for the "${niche}" niche.
Each idea should be specific, actionable, and scroll-stopping.
Return ONLY a JSON array of 10 strings. Example:
["Idea one here", "Idea two here", ...]
No markdown, no numbering inside the strings, no explanation.`;

    const raw = await generateText(prompt);
    const cleaned = stripJson(raw);
    try {
      res.json(JSON.parse(cleaned));
    } catch {
      // Fallback: split by newlines
      const ideas = cleaned
        .split('\n')
        .map(l => l.replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean)
        .slice(0, 10);
      res.json(ideas);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
