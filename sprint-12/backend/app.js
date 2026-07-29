const express = require("express");
const cors = require("cors");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

function createApp(clientUrl) {
  const app = express();

  app.use(
    cors({
      origin: clientUrl,
      methods: ["GET", "POST"],
      credentials: true,
    })
  );

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Sprint 12 real-time chat server is running",
    });
  });

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

module.exports = createApp;