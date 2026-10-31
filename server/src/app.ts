import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";

const app = express();

// Security headers
app.use(helmet());

// Allow frontend requests
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json({ limit: "10kb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "DevConnect API is running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

export default app;