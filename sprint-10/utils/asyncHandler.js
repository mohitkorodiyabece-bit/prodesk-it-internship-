// Wraps async controller functions so thrown/rejected errors
// are passed to Express's error-handling middleware automatically
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;