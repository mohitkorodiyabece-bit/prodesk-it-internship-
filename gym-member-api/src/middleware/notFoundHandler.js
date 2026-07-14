import { sendError } from '../utils/apiResponse.js';

export const notFoundHandler = (req, res) => {
  sendError(res, 404, `Route ${req.method} ${req.originalUrl} not found`);
};