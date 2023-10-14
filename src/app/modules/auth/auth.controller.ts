import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from '../user/user.interface';
import { ILoginUserResponse } from './auth.interface';
import { authService } from './auth.service';

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const user = req.body;

  const result = await authService.createUserInDB(user);

  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const loginUser: RequestHandler = catchAsync(async (req, res) => {
  const loginDAta = req.body;

  const result = await authService.loginUser(loginDAta);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User signin successfully!',
    data: result,
  });
});

export const authController = {
  createUser,
  loginUser,
};
