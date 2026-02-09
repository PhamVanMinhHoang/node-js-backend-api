import { fail } from '../utils/response.js';
import { AppError } from '../utils/appError.js';

export function errorHandler(err, req, res, next) {
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