import express from "express";

import {
  generateCaptionTool,
  generateHashtagsTool,
  generateContentIdeasTool,
  generateContentCalendarTool,
} from "../agent/tools.js";

const router = express.Router();

router.post("/caption", async (req, res) => {
  try {
    const result = await generateCaptionTool.invoke(req.body);
    res.json(JSON.parse(result));
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.post("/hashtags", async (req, res) => {
  try {
    const result = await generateHashtagsTool.invoke(req.body);
    res.json(JSON.parse(result));
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.post("/content-ideas", async (req, res) => {
  try {
    const result = await generateContentIdeasTool.invoke(req.body);
    res.json(JSON.parse(result));
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.post("/content-calendar", async (req, res) => {
  try {
    const result = await generateContentCalendarTool.invoke(req.body);
    res.json(JSON.parse(result));
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/", (req, res) => {
  res.json({
    success: true,
    services: ["caption", "hashtags", "content-ideas", "content-calendar"],
  });
});

export default router;
