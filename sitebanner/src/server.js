import express from "express";
import Redis from "ioredis";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

export const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

export const BANNER_KEY = "app:banner";

// Create / Update Banner
app.post("/banner", async (req, res) => {
  try {
    await redis.set(
      BANNER_KEY,
      req.body.message || "Welcome to Redis"
    );

    res.json({
      success: true,
      message: "Banner updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get Banner
app.get("/banner", async (req, res) => {
  try {
    const message = await redis.get(BANNER_KEY);

    res.json({
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete Banner
app.delete("/banner", async (req, res) => {
  try {
    await redis.del(BANNER_KEY);

    res.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Check if Banner Exists
app.get("/banner/exists", async (req, res) => {
  try {
    const exists = await redis.exists(BANNER_KEY);

    res.json({
      exists: Boolean(exists),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});