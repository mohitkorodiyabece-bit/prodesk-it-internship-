const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
    );
  });
};

startServer();

// Handle promise rejections that weren't caught anywhere else
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection: ${err.message}`);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Graceful shutdown on termination signals
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  if (server) server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  if (server) server.close(() => process.exit(0));
});