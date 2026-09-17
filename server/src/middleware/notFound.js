// Handles unmatched API routes with a clean 404 JSON payload.
// (The customer-facing 404 *page* lives in the React client — see client/src/pages/NotFound.jsx.)
export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
}
