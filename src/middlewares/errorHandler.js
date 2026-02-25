import { fail } from '../utils/response.js';
import { AppError } from '../utils/appError.js';
import { ZodError } from 'zod';

export function errorHandler(err, req, res, next) {
    // ✅ Zod validation -> 400
    if (err instanceof ZodError) {
        const details = err.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message
        }));
        return fail(res, 400, 'VALIDATION_ERROR', 'Validation failed', details);
    }

    // ✅ Map duplicate key (E11000) -> 409
    if (err?.code === 11000) {
        const fields = Object.keys(err.keyValue || {});
        const field = fields[0] || 'field';
        return fail(res, 409, 'DUPLICATE_KEY', `${field} already exists`, err.keyValue || null);
    }

    // ✅ Map mongoose validation error -> 400
    if (err?.name === 'ValidationError') {
        const details = Object.fromEntries(
        Object.entries(err.errors || {}).map(([k, v]) => [k, v.message])
        );
        return fail(res, 400, 'VALIDATION_ERROR', 'Validation failed', details);
    }

    const isAppError = err instanceof AppError;

    const statusCode = isAppError ? err.statusCode : 500;
    const code = isAppError ? err.code : 'INTERNAL_ERROR';
    const message = isAppError ? err.message : 'Internal server error';

     // ✅ Không leak stack trace ra client
    // dev thì có thể log stack ra console
    if (process.env.NODE_ENV !== 'test') {
        console.error(err);
    }

    return fail(res, statusCode, code, message, isAppError ? err.details : null);
}