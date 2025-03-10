import { NextFunction, Request, Response } from 'express';
import { AppError, errorTypeToStatusCode, isAppError } from '../utils/errorUtils';

export function errorHandlerMiddleware(
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // eslint-disable-next-line no-console
    console.log(err);

    if (isAppError(err)) {
        return res.status(errorTypeToStatusCode(err.type)).send(err.message);
    }

    res.sendStatus(500);
    return next();
}
