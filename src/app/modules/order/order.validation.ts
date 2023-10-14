import { OrderStatus } from '@prisma/client';
import { z } from 'zod';

const orderedBookZodSchema = z.object({
  bookId: z.string({ required_error: 'Book ID is required' }),
  quantity: z.number({ required_error: 'Quantity is required' }),
});

const createOrderZodSchema = z.object({
  body: z.object({
    status: z
      .enum([OrderStatus.pending, OrderStatus.shipped, OrderStatus.delivered])
      .default(OrderStatus.pending),
    orderedBooks: z.array(orderedBookZodSchema).min(1),
  }),
});

export const orderValidation = {
  createOrderZodSchema,
};
