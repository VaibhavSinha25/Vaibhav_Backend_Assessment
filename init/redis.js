// This file initializes a Redis client using ioredis
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL); // Initialize Redis client with the URL

//redis connection events
redis.on("connect", () => {
  console.log("Redis client connected successfully");
});
redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redis;
