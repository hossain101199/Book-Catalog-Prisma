import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { IUser } from '../user/user.interface';
import { ILoginUser, ILoginUserResponse } from './auth.interface';

const createUserInDB = async (payload: User): Promise<IUser> => {
  payload.password = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const createdUser = await prisma.user.create({
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

  return createdUser;
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      role: true,
      password: true,
    },
  });

  if (isUserExist) {
    if (await bcrypt.compare(password, isUserExist.password)) {
      const { id, role } = isUserExist;

      const accessToken = jwt.sign(
        {
          id,
          role,
        },
        config.jwt.secret as Secret,
        { expiresIn: config.jwt.expires_in }
      );

      return {
        accessToken,
      };
    } else {
      throw new ApiError(401, 'Password is incorrect');
    }
  } else {
    throw new ApiError(404, 'User does not exist');
  }
};

export const authService = {
  createUserInDB,
  loginUser,
};
