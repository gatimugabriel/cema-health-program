import { NextFunction, Request, Response } from "express";
import { QueryFailedError } from "typeorm";

const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

const handleErrors = (error: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = error?.customMessage || error.message || 'Internal Server Error Occurred. Try again later';

    // DB errors -> raised by TYPEORM
    if (error instanceof QueryFailedError) {
        const dbError = handleDBErrors(error);
        message = dbError.message;
        statusCode = dbError.statusCode;
    }

    if (message.includes('Invalid')) {
        statusCode = 400
    }

    if (message.includes('Invalid credentials')) {
        statusCode = 401
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env["NODE_ENV"] === 'production' ? '🥞' : error.stack,
    });
}

export const handleDBErrors = (error: any) => {
    if (error instanceof QueryFailedError) {
        const err = error as any;
        switch (err.code) {
            case "23505":
                // Extract the field name from the detail message
                const fieldMatch = err.detail.match(/\(([^)]+)\)/);
                const field = fieldMatch ? fieldMatch[1] : 'field';
                return {
                    message: `This ${field} is already in use`,
                    statusCode: 409 
                };
            case '23503':
                return {
                    message: `Related record not found for field: ${err.detail.match(/\(([^)]+)\)/)[1]}`,
                    statusCode: 400
                };
            case '23502':
                return {
                    message: `Field cannot be null: ${err.detail.match(/\(([^)]+)\)/)[1]}`,
                    statusCode: 400
                };
            case '22P02':
                return {
                    message: `Invalid input syntax for type: ${err.detail.match(/\(([^)]+)\)/)[1]}`,
                    statusCode: 400
                };
            default:
                return {
                    message: 'Internal server error',
                    statusCode: 500
                };
        }
    }
    return {
        message: error.message,
        statusCode: 500
    };
}

export default { notFound, handleErrors }
