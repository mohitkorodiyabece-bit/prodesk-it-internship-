const ErrorResponse = require("../utils/errorResponse");

// Catches any request that didn't match a route
const notFoundMiddleware = (req, res, next) => {
  next(new ErrorResponse(`Route not found - ${req.originalUrl}`, 404));
};

module.exports = notFoundMiddleware;