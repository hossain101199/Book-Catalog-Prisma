import { Category, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { categorySearchableFields } from './category.constant';
import { ICategoryFilters } from './category.interface';

const createCategoryInDB = async (payload: Category): Promise<Category> => {
  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getSingleCategoryFromDB = async (
  payload: string
): Promise<Category | null> => {
  const result = await prisma.category.findUnique({
    where: {
      id: payload,
    },
    include: {
      books: true,
    },
  });

  return result;
};

const updateCategoryInDB = async (
  id: string,
  payload: Category
): Promise<Category | null> => {
  const result = await prisma.category.update({
    where: {
      id,
    },

    data: payload,
  });

  return result;
};

const deleteCategoryFromDB = async (
  payload: string
): Promise<Category | null> => {
  const result = await prisma.category.delete({
    where: {
      id: payload,
    },
  });

  return result;
};

const getAllCategoriesFromDB = async (
  filters: ICategoryFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Category[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: categorySearchableFields.map(field => ({
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

  const whereConditions: Prisma.CategoryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const sortConditions: { [key: string]: string } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await prisma.category.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.category.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const categoryService = {
  createCategoryInDB,
  getSingleCategoryFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
  getAllCategoriesFromDB,
};
