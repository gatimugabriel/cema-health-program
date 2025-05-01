import { check } from "express-validator";

export const validateSignUpdata = [
    check('email')
        .isEmail()
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .notEmpty()
        .withMessage('Password is required'),
    check('firstName').notEmpty().withMessage('First name is required').isLength({ min: 3 }).withMessage("firstName should be at least 3 characters"),
    check('lastName').notEmpty().withMessage('Last name is required').isLength({ min: 3 }).withMessage("lastName should be at least 3 characters"),
    check('phone').isMobilePhone('any').withMessage('Phone number must be valid'),
]

export const validateSignInData = [
    check('email')
        .isEmail()
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required'),
    check('password')
        .notEmpty()
        .withMessage('Password is required')
]

