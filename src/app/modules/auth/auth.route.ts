import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from '../user/user.validation';
import { authController } from './auth.controller';
import { authValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(userValidation.createUserZodSchema),
  authController.createUser
);

router.post(
  '/signin',
  validateRequest(authValidation.loginZodSchema),
  authController.loginUser
);

export const authRoutes = router;
