import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { userController } from './user.controller';
import { userValidation } from './user.validation';

const router = express.Router();

router.get('/:id', auth(UserRole.ADMIN), userController.getSingleUser);

router.patch(
  '/:id',
  auth(UserRole.ADMIN),
  validateRequest(userValidation.updateUserZodSchema),
  userController.updateUser
);

router.delete('/:id', auth(UserRole.ADMIN), userController.deleteUser);

router.get('/', auth(UserRole.ADMIN), userController.getAllUsers);

export const userRoutes = router;
