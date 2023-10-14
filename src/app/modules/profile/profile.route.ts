import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { profileController } from './profile.controller';

const router = express.Router();

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  profileController.getProfile
);

export const profileRoutes = router;
