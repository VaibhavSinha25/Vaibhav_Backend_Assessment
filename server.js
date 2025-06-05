// --------------------------------------------
//  Environment Setup
// --------------------------------------------
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

// --------------------------------------------
// Core Modules and Middleware
// --------------------------------------------
import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./init/db.js";
import limiter from "./middlewares/rateLimiter.js";
import morgan from "morgan";

// --------------------------------------------
//  Route Imports
// --------------------------------------------
import chapterRouter from "./routes/chapterRoutes.js";

// --------------------------------------------
//  App Initialization
// --------------------------------------------
const app = express();

// --------------------------------------------
//  Global Middleware
// --------------------------------------------

// Security headers
app.use(helmet());

// Logging middleware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev")); // Concise colored dev logging
} else {
  app.use(morgan("combined")); // Standard Apache combined log format for production
}

// Body parsers
app.use(express.json({ limit: "10mb", type: "application/json" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
    type: "application/x-www-form-urlencoded",
  })
);

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting
app.use(limiter);

// --------------------------------------------
//  Routes
// --------------------------------------------
app.use("/api/v1/chapters", chapterRouter);

// --------------------------------------------
//  Error Handling Middleware
// --------------------------------------------
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Server error",
  });
});

// --------------------------------------------
//  Global Exception Handlers
// --------------------------------------------
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// --------------------------------------------
//  Start Server (after DB connects)
// --------------------------------------------
await connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
