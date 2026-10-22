import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Check if headers already sent
  if (res.headersSent) {
    return next(err);
  }

  // Zod validation error
  if (err instanceof ZodError) {
    const errorMessages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      })),
      message: errorMessages
    });
    return;
  }

  // Mongoose CastError or duplicate key
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      error: 'Invalid resource identifier format.'
    });
    return;
  }

  const statusCode = err.statusCode || err.status || 500;
  const isProd = env.NODE_ENV === 'production';

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 && isProd
      ? 'An unexpected error occurred while processing your request. Please try again later.'
      : err.message || 'Server error',
    ...(isProd ? {} : { stack: err.stack })
  });
}
