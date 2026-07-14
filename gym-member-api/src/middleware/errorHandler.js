import { sendError } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return sendError(res, 400, 'Invalid JSON in request body');
  }

  console.error(err);
  return sendError(res, 500, 'An unexpected server error occurred');
};