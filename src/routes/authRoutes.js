import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';

const router = Router();

router.post('/auth/register', registerUserSchema, authController.registerUser);
router.post('/auth/login', loginUserSchema, authController.loginUser);
router.post('/auth/refresh', authController.refreshUserSession);
router.post('/auth/logout', authController.logoutUser);

export default router;
