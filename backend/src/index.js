import express from "express";
import cors from "cors";
import { config } from "./config.js";
import agentRouter from "./routes/agent.js";

// Start CROO Provider
import "./croo/provider.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root
app.get("/", (req, res) => {
  res.json({
    name: "BrandForge AI",
    version: "1.0.0",
    status: "running",
    description:
      "AI-powered content creation agent for brands, marketers and creators. Generate captions, hashtags, ad copy and content ideas through CROO Agent Protocol.",

    services: [
      "/agent/caption",
      "/agent/hashtags",
      "/agent/ad-copy",
      "/agent/content-ideas",
    ],

    croo: true,
  });
});

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// AI Routes
app.use("/agent", agentRouter);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

app.listen(config.port, () => {
  console.log("======================================");
  console.log("🚀 BrandForge AI");
  console.log(`🌍 http://localhost:${config.port}`);
  console.log("🤖 CROO Provider Connected");
  console.log("======================================");
});
