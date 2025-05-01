import { check } from "express-validator";
import { validate } from "./baseValidator";

export const validateProgramData = [
    check('name').notEmpty().withMessage('Program Name is required'),
    check('description').optional(),
    validate
]
