import {validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";

export const validate = (req: Request, res: Response, next: NextFunction):void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({errors: errors.array()});
        return
    }
    next();
};

export const requireBody = (req: Request, res: Response, next: NextFunction):void => {
    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400);
        throw new Error("Request body is missing");
    }
    next()
}

