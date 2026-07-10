import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 8000,

  geminiApiKey: process.env.GEMINI_API_KEY,

  jwtSecret: process.env.JWT_SECRET,

  databaseUrl: process.env.DATABASE_URL,

  uploadDir: process.env.UPLOAD_DIR || "./uploads",

  crooApiUrl: process.env.CROO_API_URL || "https://api.croo.network",

  crooWsUrl: process.env.CROO_WS_URL || "wss://api.croo.network/ws",

  crooSdkKey: process.env.CROO_SDK_KEY,

  baseRpcUrl: process.env.BASE_RPC_URL || "https://mainnet.base.org",
};
