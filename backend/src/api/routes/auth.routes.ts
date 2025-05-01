import { Router, Request, Response } from 'express';
import { validateSignInData, validateSignUpdata } from '../middleware/inputValidation/user';
import { validate } from '../middleware/inputValidation/baseValidator';
import { AuthController } from '../controllers/AuthContoller';

const router = Router();
const controller = new AuthController()

router.post('/signup',[...validateSignUpdata, validate], controller.signup.bind(controller));
router.post('/signin',[...validateSignInData, validate], controller.signin.bind(controller));

export default router; 