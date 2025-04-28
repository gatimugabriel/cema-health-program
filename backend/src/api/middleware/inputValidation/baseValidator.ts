import {query, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";

/**
 * Final Validator Method that SHOULD be called after all validations are done
 * It is important as it is responsible for generating an array of error responses from all other validation middlewares
 * */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({errors: errors.array()});
        return
    }
    next();
};


//------- Common Validators that can be reused across many endpoints in different domains --------//

export const requireBody = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400);
        throw new Error("Request body is missing");
    }
    next()
}

/**
 * Search and Pagination Endpoints
 * For search query validation, it is important to note that the query is optional
 *  and the query string is validated only if it exists
 * */
export const validateSearchQuery = [
    query('q').optional().isString().withMessage('Search query must be a string'),
    query('paginate').optional().isBoolean().withMessage('paginate option must be a true/false'),
    query('page').optional().isInt({min: 1}).withMessage('Page must be a positive integer'),
    query('pageSize').optional().isInt({min: 1, max: 100}).withMessage('Page size must be between 1 and 100')
];



