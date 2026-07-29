function errorMiddleware(err, req, res, next) {
  console.error("Unhandled Express error:", err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
}

module.exports = errorMiddleware;