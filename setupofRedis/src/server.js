import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3000;

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.get('/redis', async (req, res) => {
    try {
        const reply = await redis.ping(); 
        console.log(`[Redis] Ping-Pong successful: ${reply}`);
        res.json({
            redisValue: reply 
        });
    } catch (error) {
        console.error(`[Redis] Connection Error: ${error.message}`);
        res.status(500).json({ error: "Redis Connection Failed", details: error.message });
    }
});

app.get('/mongodb', async (req, res) => {
    const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/mongoose1';

    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(url);
        }
        console.log(`[MongoDB] Connected successfully to database: ${mongoose.connection.name}`);
        res.json({
            mongodb: "connected",
            database: mongoose.connection.name
        });
    } catch (error) {
        console.error(`[MongoDB] Connection Error: ${error.message}`);
        res.status(500).json({ error: "MongoDB Connection Failed", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});