function notFoundHandler(req, res, next) {
  res.status(404).json({ success: false, message: `Route not found - ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error('API Error Stack:', err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.stack
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
