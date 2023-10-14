import { Order, Prisma, UserRole } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { orderSearchableFields } from './order.constant';
import { IOrderData, IOrderFilters } from './order.interface';

const createOrderInDB = async (
  userId: string,
  payload: IOrderData
): Promise<Order> => {
  const createdOrder = await prisma.order.create({
    data: {
      userId,
      status: payload.status,
      orderedBooks: {
        createMany: {
          data: payload.orderedBooks.map(book => ({
            bookId: book.bookId,
            quantity: book.quantity,
          })),
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          contactNo: true,
          address: true,
          profileImg: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      orderedBooks: {
        include: {
          book: true,
        },
      },
    },
  });

  return createdOrder;
};

const getSingleOrderFromDB = async (
  id: string,
  user: JwtPayload
): Promise<Order | null> => {
  let result;

  if (user.role === UserRole.CUSTOMER) {
    result = await prisma.order.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            contactNo: true,
            address: true,
            profileImg: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        orderedBooks: {
          include: {
            book: true,
          },
        },
      },
    });
    if (!result) {
      throw new ApiError(401, 'You are not authorized');
    }
  } else {
    result = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            contactNo: true,
            address: true,
            profileImg: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        orderedBooks: {
          include: {
            book: true,
          },
        },
      },
    });
  }

  return result;
};

const getAllOrdersFromDB = async (
  filters: IOrderFilters,
  paginationOptions: IPaginationOptions,
  user: JwtPayload
): Promise<IGenericResponse<Order[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: orderSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: {
          equals: value,
        },
      })),
    });
  }

  let whereConditions: Prisma.OrderWhereInput;

  if (user.role === UserRole.CUSTOMER) {
    whereConditions =
      andConditions.length > 0
        ? {
            AND: [...andConditions, { userId: user.id }],
          }
        : { userId: user.id };
  } else {
    whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
  }

  const sortConditions: { [key: string]: string } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await prisma.order.findMany({
    where: whereConditions,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          contactNo: true,
          address: true,
          profileImg: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      orderedBooks: {
        include: {
          book: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.order.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const orderService = {
  createOrderInDB,
  getSingleOrderFromDB,
  getAllOrdersFromDB,
};

/*
## another approach to create order

const createOrderInDB = async (
  userId: string,
  payload: IOrderData
): Promise<Order | undefined | null> => {
  const createdNewOrder = await prisma.$transaction(async transactionClient => {
    const createdOrder = await transactionClient.order.create({
      data: { userId: userId, status: payload.status },
    });

    if (createdOrder) {
      for (let index = 0; index < payload.orderedBooks.length; index++) {
        const data = {
          orderId: createdOrder.id,
          bookId: payload.orderedBooks[index].bookId,
          quantity: payload.orderedBooks[index].quantity,
        };
        const addedBooks = await transactionClient.orderedBook.create({
          data,
        });

        if (addedBooks && index + 1 == payload.orderedBooks.length) {
          return createdOrder;
        }
      }
    }
  });

  if (createdNewOrder) {
    const orderedData = await prisma.order.findUnique({
      where: { id: createdNewOrder.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            contactNo: true,
            address: true,
            profileImg: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        orderedBooks: {
          include: {
            book: true,
          },
        },
      },
    });

    return orderedData;
  }
};
*/
