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
        handleDBErrors(error);
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
                return `Duplicate value for field: ${err.detail.match(/\(([^)]+)\)/)[1]}`;
            case '23503':
                return `Related record not found for field: ${err.detail.match(/\(([^)]+)\)/)[1]}`;
            case '23502':
                return `Field cannot be null: ${err.detail.match(/\(([^)]+)\)/)[1]}`;
            case '22P02':
                return `Invalid input syntax for type: ${err.detail.match(/\(([^)]+)\)/)[1]}`;
            default:
                return 'Internal server error';
        }
    }
    return error.message;
}

export default { notFound, handleErrors }
