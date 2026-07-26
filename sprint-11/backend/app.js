const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sprint 11 MERN API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

/*
 * Vercel may execute app.js directly instead of server.js.
 * Therefore, connect to MongoDB before running post routes.
 */
app.use("/api/posts", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/posts", postRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;