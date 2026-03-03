import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import logger from '../utils/logger';

// If you have specific error handlers like handleCastErrorDB, import or define them here
// const handleCastErrorDB = (err: any) => ...

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 1. Set default status and message
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // 2. Development Logic: Detailed logs and stack traces
    if (process.env.NODE_ENV === 'development') {
        logger.error('ERROR 💥', err);
        return sendError(res, err.statusCode, err.message, err.stack);
    }

    // 3. Production Logic: Clean, user-friendly errors
    // Use Object.create to ensure we don't lose the original error prototype/message
    let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
    error.message = err.message;

    // Handle specific MongoDB or JWT errors (assuming these helpers are in scope)
    if (error.name === 'CastError') error = (err as any).handleCastErrorDB?.(error) || error;
    if (error.code === 11000) error = (err as any).handleDuplicateFieldsDB?.(error) || error;
    if (error.name === 'ValidationError') error = (err as any).handleValidationErrorDB?.(error) || error;
    if (error.name === 'JsonWebTokenError') error = { statusCode: 401, message: 'Invalid token. Please log in again!', isOperational: true };
    if (error.name === 'TokenExpiredError') error = { statusCode: 401, message: 'Your token has expired!', isOperational: true };

    // Operational errors (trusted errors we created)
    if (error.isOperational) {
        return sendError(res, error.statusCode, error.message);
    }

    // Programming or unknown errors: don't leak details
    logger.error('ERROR 💥', err);
    return sendError(res, 500, 'Something went very wrong!');
};