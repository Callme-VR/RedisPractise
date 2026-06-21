import express from "express";
import Redis from "ioredis";

const app = express();
const PORT = process.env.PORT || 4000;

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

export const BANNER_KEY = "app:banner";

/**
 * Create / Update Banner
 */
app.post("/banner", async (req, res) => {
  try {
    const bannerMessage = req.body.message || "Welcome to Redis";

    await redis.set(BANNER_KEY, bannerMessage);

    console.log(`✅ Banner Updated: ${bannerMessage}`);

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      banner: bannerMessage,
    });
  } catch (error) {
    console.error("❌ Error Updating Banner:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Get Banner
 */
app.get("/banner", async (req, res) => {
  try {
    const message = await redis.get(BANNER_KEY);

    if (!message) {
      console.log("⚠️ No Banner Found");

      return res.status(404).json({
        success: false,
        message: "No banner found",
      });
    }

    console.log(`📢 Banner Retrieved: ${message}`);

    res.status(200).json({
      success: true,
      banner: message,
    });
  } catch (error) {
    console.error("❌ Error Fetching Banner:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Delete Banner
 */
app.delete("/banner", async (req, res) => {
  try {
    const deletedCount = await redis.del(BANNER_KEY);

    if (deletedCount === 0) {
      console.log("⚠️ No Banner Found To Delete");

      return res.status(404).json({
        success: false,
        message: "No banner found to delete",
      });
    }

    console.log("🗑️ Banner Deleted Successfully");

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error Deleting Banner:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Check if Banner Exists
 */
app.get("/banner/exists", async (req, res) => {
  try {
    const banner = await redis.get(BANNER_KEY);

    if (!banner) {
      console.log("❌ Banner Does Not Exist");

      return res.status(404).json({
        success: false,
        message: "Banner does not exist",
      });
    }

    console.log("✅ Banner Exists");

    res.status(200).json({
      success: true,
      message: "Banner exists",
      banner,
    });
  } catch (error) {
    console.error("❌ Error Checking Banner:", error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`🌐 API URL: http://localhost:${PORT}`);
});