import { check } from "express-validator";

export const validateEnrollmentData = [
    check('clientID')
        .notEmpty().withMessage('Client ID is required')
        .isUUID().withMessage('Client ID must be a valid UUID'),
    check('programID')
        .notEmpty().withMessage('Program ID is required')
        .isUUID().withMessage('Program ID must be a valid UUID'),
    check('enrollmentDate')
        .optional()
        .isISO8601().withMessage('Enrollment date must be a valid date'),
    check('status')
        .optional()
        .isIn(['active', 'completed', 'withdrawn']).withMessage('Status must be active, completed, or withdrawn'),
    check('notes').optional()
];

export const validateEnrollmentUpdateData = [
    check('enrollmentDate')
        .optional()
        .isISO8601().withMessage('Enrollment date must be a valid date'),
    check('exitDate')
        .optional()
        .isISO8601().withMessage('Exit date must be a valid date'),
    check('status')
        .optional()
        .isIn(['active', 'completed', 'withdrawn']).withMessage('Status must be active, completed, or withdrawn'),
    check('notes').optional()
];