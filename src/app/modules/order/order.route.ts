import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { orderController } from './order.controller';
import { orderValidation } from './order.validation';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.CUSTOMER),
  validateRequest(orderValidation.createOrderZodSchema),
  orderController.createOrder
);

router.get(
  '/:id',
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  orderController.getSingleOrder
);

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  orderController.getAllOrders
);

export const orderRoutes = router;
