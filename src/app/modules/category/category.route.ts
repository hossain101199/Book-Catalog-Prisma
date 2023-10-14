import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { categoryController } from './category.controller';
import { categoryValidation } from './category.validation';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.ADMIN),
  validateRequest(categoryValidation.createCategoryZodSchema),
  categoryController.createCategory
);

router.get('/:id', categoryController.getSingleCategory);

router.patch(
  '/:id',
  auth(UserRole.ADMIN),
  validateRequest(categoryValidation.updateCategoryZodSchema),
  categoryController.updateCategory
);

router.delete('/:id', auth(UserRole.ADMIN), categoryController.deleteCategory);

router.get('/', categoryController.getAllCategories);

export const categoryRoutes = router;
