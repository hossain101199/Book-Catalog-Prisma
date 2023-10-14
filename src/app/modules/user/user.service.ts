import { Prisma, User } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { userSearchableFields } from './user.constant';
import { IUser, IUserFilters } from './user.interface';

const getSingleUserFromDB = async (payload: string): Promise<IUser | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id: payload,
    },
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
  });

  return result;
};

const updateUserInDB = async (
  id: string,
  payload: Partial<User>
): Promise<IUser | null> => {
  const result = await prisma.user.update({
    where: {
      id,
    },

    data: payload,

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
  });

  return result;
};

const deleteUserFromDB = async (payload: string): Promise<IUser | null> => {
  const result = await prisma.user.delete({
    where: {
      id: payload,
    },

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
  });

  return result;
};

const getAllUsersFromDB = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map(field => ({
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

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const sortConditions: { [key: string]: string } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
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
  });

  const total = await prisma.user.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const userService = {
  getSingleUserFromDB,
  updateUserInDB,
  deleteUserFromDB,
  getAllUsersFromDB,
};
