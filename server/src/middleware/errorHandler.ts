import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err); // Log the error for debugging

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Default to 500 if status code not set
  let message = err.message || 'Internal Server Error';

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400; // Bad Request
    message = `Resource not found with id of ${err.value}`;
  }

  // Mongoose duplicate key (code 11000) - Handled in controllers, but catch here just in case
  if (err.code === 11000) {
    statusCode = 409; // Conflict
    // Extract field name from error message if possible
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for ${field}. Please use another value.`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400; // Bad Request
    // Combine multiple validation errors if they exist
    const errors = Object.values(err.errors).map((el: any) => el.message);
    message = `Invalid input data: ${errors.join('. ')}`;
  }

  res.status(statusCode).json({
    message: message,
    // Optionally include stack trace in development environment
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

export default errorHandler;