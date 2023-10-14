import { Category } from '@prisma/client';
import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { categoryFilterableFields } from './category.constant';
import { categoryService } from './category.service';

const createCategory: RequestHandler = catchAsync(async (req, res) => {
  const user = req.body;

  const result = await categoryService.createCategoryInDB(user);

  sendResponse<Category>(res, {
    statusCode: 200,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getSingleCategory: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await categoryService.getSingleCategoryFromDB(id);

  if (result === null) {
    sendResponse<Category>(res, {
      statusCode: 404,
      success: false,
      message: `Error: Category with ID ${id} is not found. Please verify the provided ID and try again`,
      data: result,
    });
  } else {
    sendResponse<Category>(res, {
      statusCode: 200,
      success: true,
      message: 'Category retrieved successfully',
      data: result,
    });
  }
});

const updateCategory: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updatedCategoryData = req.body;

  const result = await categoryService.updateCategoryInDB(
    id,
    updatedCategoryData
  );

  if (result === null) {
    throw new ApiError(
      404,
      `Error: Category with ID ${id} is not found. Please verify the provided ID and try again`
    );
  } else {
    sendResponse<Category>(res, {
      statusCode: 200,
      success: true,
      message: 'Category updated successfully',
      data: result,
    });
  }
});

const deleteCategory: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await categoryService.deleteCategoryFromDB(id);

  if (result === null) {
    throw new ApiError(
      404,
      `Error: Category with ID ${id} is not found. Please verify the provided ID and try again`
    );
  } else {
    sendResponse<Category>(res, {
      statusCode: 200,
      success: true,
      message: 'Category deleted successfully',
      data: result,
    });
  }
});

const getAllCategories: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, categoryFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await categoryService.getAllCategoriesFromDB(
    filters,
    paginationOptions
  );

  sendResponse<Category[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Categories retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const categoryController = {
  createCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
};
