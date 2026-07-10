# BrandForge AI

AI-powered content generation dashboard — React + Next.js + Tailwind.

## Setup

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Backend

Add the 4 agent routes to your existing Express server:

```js
// In src/index.js, add:
import brandforgeRouter from './routes/brandforgeAgent.js';
app.use('/agent', brandforgeRouter);
```

Copy `brandforgeAgent.js` to `src/routes/brandforgeAgent.js` in your backend.

## Endpoints

| Method | Route | Body |
|--------|-------|------|
| POST | /agent/caption | `{ topic, platform }` |
| POST | /agent/hashtags | `{ topic, platform }` |
| POST | /agent/ad-copy | `{ product, platform }` |
| POST | /agent/content-ideas | `{ niche }` |

## Change API URL

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```
