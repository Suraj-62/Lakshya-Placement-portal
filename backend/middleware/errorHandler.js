export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  console.error("Global Error Handler Catch:", {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method
  });

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  res.status(statusCode).json({
    message: message || "Internal Server Error",
    error: err.message,
    details: err.stack, // Temporarily adding stack to see where it fails
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};