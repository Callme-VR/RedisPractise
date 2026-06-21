import express from "express";
import Redis from "ioredis";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Redis Connection
export const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redis.on("error", (err) => {
  console.error("❌ Redis Connection Error:", err.message);
});


 
















/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`🌐 API URL: http://localhost:${PORT}`);
});