import { Order } from '@prisma/client';
import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { orderFilterableFields } from './order.constant';
import { orderService } from './order.service';

const createOrder: RequestHandler = catchAsync(async (req, res) => {
  if (!req.verifiedUser) {
    throw new ApiError(403, 'Forbidden');
  }

  const { id: userId } = req.verifiedUser;

  const orderData = req.body;

  const result = await orderService.createOrderInDB(userId, orderData);

  sendResponse<Order>(res, {
    statusCode: 200,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const getSingleOrder: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  if (!req.verifiedUser) {
    throw new ApiError(403, 'Forbidden');
  }

  const user = req.verifiedUser;
  const result = await orderService.getSingleOrderFromDB(id, user);

  if (result === null) {
    sendResponse<Order>(res, {
      statusCode: 404,
      success: false,
      message: `Error: Order with ID ${id} is not found. Please verify the provided ID and try again`,
      data: result,
    });
  } else {
    sendResponse<Order>(res, {
      statusCode: 200,
      success: true,
      message: 'Order retrieved successfully',
      data: result,
    });
  }
});

const getAllOrders: RequestHandler = catchAsync(async (req, res) => {
  if (!req.verifiedUser) {
    throw new ApiError(403, 'Forbidden');
  }

  const user = req.verifiedUser;

  const filters = pick(req.query, orderFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await orderService.getAllOrdersFromDB(
    filters,
    paginationOptions,
    user
  );

  sendResponse<Order[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Orders retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const orderController = {
  createOrder,
  getSingleOrder,
  getAllOrders,
};
