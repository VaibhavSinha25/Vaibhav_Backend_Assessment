// Rate Limiter Middleware which limits the number of requests from a single IP address
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../init/redis.js";

const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args), // Redis for storing rate limit data
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  keyGenerator: (req) => req.ip, // Use IP address as the key
  handler: (req, res) => {
    // Custom handler for rate limit exceeded
    res.status(429).json({
      error: "Too many requests. Please try again in a minute.",
    });
  },
});

export default limiter;
