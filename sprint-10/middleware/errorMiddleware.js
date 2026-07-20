// Central error handler - keeps all error responses in a consistent shape
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";

  // Invalid MongoDB ObjectId format (e.g. malformed :id param)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }

  // Mongoose schema validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(", ");
    message = `Duplicate value for field: ${field}`;
  }

  // Malformed JSON sent in the request body
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON in request body";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;