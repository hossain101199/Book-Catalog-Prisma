import prisma from '../../../shared/prisma';
import { IUser } from '../user/user.interface';

const getProfileFromDB = async (payload: string): Promise<IUser | null> => {
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

export const profileService = {
  getProfileFromDB,
};
