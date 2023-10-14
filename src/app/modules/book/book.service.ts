import { Book, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { bookSearchableFields } from './book.constant';
import { IBookFilters } from './book.interface';

const createBookInDB = async (payload: Book): Promise<Book> => {
  const result = await prisma.book.create({
    data: payload,

    include: { category: true },
  });

  return result;
};

const getSingleBookFromDB = async (payload: string): Promise<Book | null> => {
  const result = await prisma.book.findUnique({
    where: {
      id: payload,
    },

    include: { category: true },
  });

  return result;
};

const getBooksByCategoryFromDB = async (
  payload: string
): Promise<Book[] | null> => {
  const result = await prisma.book.findMany({
    where: {
      categoryId: payload,
    },

    include: { category: true },
  });

  return result;
};

const updateBookInDB = async (
  id: string,
  payload: Partial<Book>
): Promise<Book | null> => {
  const result = await prisma.book.update({
    where: {
      id,
    },

    data: payload,

    include: { category: true },
  });

  return result;
};

const deleteBookFromDB = async (payload: string): Promise<Book | null> => {
  const result = await prisma.book.delete({
    where: {
      id: payload,
    },

    include: { category: true },
  });

  return result;
};

const getAllBooksFromDB = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Book[]>> => {
  const { searchTerm, minPrice, maxPrice, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: bookSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (minPrice && maxPrice) {
    andConditions.push({
      price: {
        gte: Number(minPrice),
        lte: Number(maxPrice),
      },
    });
  } else if (minPrice) {
    andConditions.push({
      price: {
        gte: Number(minPrice),
      },
    });
  } else if (maxPrice) {
    andConditions.push({
      price: {
        lte: Number(maxPrice),
      },
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

  const whereConditions: Prisma.BookWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const sortConditions: { [key: string]: string } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await prisma.book.findMany({
    where: whereConditions,
    include: { category: true },
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.book.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const bookService = {
  createBookInDB,
  getSingleBookFromDB,
  getBooksByCategoryFromDB,
  updateBookInDB,
  deleteBookFromDB,
  getAllBooksFromDB,
};
