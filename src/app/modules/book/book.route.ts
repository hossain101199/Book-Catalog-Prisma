import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { bookController } from './book.controller';
import { bookValidation } from './book.validation';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.ADMIN),
  validateRequest(bookValidation.createBookZodSchema),
  bookController.createBook
);

router.get('/:id', bookController.getSingleBook);

router.get('/:categoryId/category', bookController.getBooksByCategory);

router.patch(
  '/:id',
  auth(UserRole.ADMIN),
  validateRequest(bookValidation.updateBookZodSchema),
  bookController.updateBook
);

router.delete('/:id', auth(UserRole.ADMIN), bookController.deleteBook);

router.get('/', bookController.getAllBooks);

export const bookRoutes = router;
