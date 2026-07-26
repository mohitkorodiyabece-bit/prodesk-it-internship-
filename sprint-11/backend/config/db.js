const mongoose = require("mongoose");

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10,
      })
      .then((connection) => {
        console.log(
          `MongoDB connected: ${connection.connection.host}`
        );

        return connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  await connectionPromise;

  return mongoose.connection;
};

module.exports = connectDB;
