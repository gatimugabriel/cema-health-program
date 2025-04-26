import {check, body, query} from "express-validator";

export const validateClientData = [
    check('firstName').notEmpty().withMessage('First name is required').isLength({ min: 3 }).withMessage("firstName should be at least 3 characters"),
    check('lastName').notEmpty().withMessage('Last name is required').isLength({ min: 3 }).withMessage("lastName should be at least 3 characters"),
    check('identificationNumber').notEmpty().withMessage('Identification number is required'),
    check('dateOfBirth')
        .notEmpty().withMessage('Date of birth is required')
        .isISO8601().withMessage('Date of birth must be a valid date'),
    check('gender')
        .notEmpty().withMessage('Gender is required')
        .isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),

    check('email')
        .optional()
        .isEmail().withMessage('Email must be valid'),

    check('phone')
        .optional()
        .isMobilePhone('any').withMessage('Phone number must be valid'),

    //custom validator to ensure at least one of email/phone
    body().custom((value) => {
        if (!value.email && !value.phone) {
            throw new Error('Either email or phone must be provided, Or even both, but you cannot have both missing');
        }
        return true;
    }),
];

export const validateClientUpdateData = [
    check('firstName').optional().isLength({ min: 3 }).withMessage("firstName should be at least 3 characters"),
    check('lastName').optional().isLength({ min: 3 }).withMessage("lastName should be at least 3 characters"),
    check('email')
        .optional()
        .isEmail().withMessage('Email must be valid'),
    check('phone')
        .optional()
        .isMobilePhone('any').withMessage('Phone number must be valid'),
    check('address').optional()
];

export const validateClientSearchQuery = [
    query('q').optional().isString().withMessage('Search query must be a string'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('pageSize').optional().isInt({ min: 1, max: 100 }).withMessage('Page size must be between 1 and 100')
];