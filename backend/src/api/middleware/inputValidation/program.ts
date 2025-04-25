import { check } from "express-validator";

export const validateProgramData = [
    check('name').notEmpty().withMessage('Program Name is required'),
    check('description').optional()
]
