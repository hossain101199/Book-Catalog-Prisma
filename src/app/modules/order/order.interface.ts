import { OrderStatus } from '@prisma/client';

export type IOrderData = {
  status?: OrderStatus;
  orderedBooks: {
    bookId: string;
    quantity: number;
  }[];
};

export type IOrderFilters = {
  searchTerm?: string;
  userId?: string;
  status?: string;
};
