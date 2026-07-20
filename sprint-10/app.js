const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MongoDB Post API is running",
  });
});

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;