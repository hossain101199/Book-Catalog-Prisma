import { Book } from '@prisma/client';
import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { bookFilterableFields } from './book.constant';
import { bookService } from './book.service';

const createBook: RequestHandler = catchAsync(async (req, res) => {
  const user = req.body;

  const result = await bookService.createBookInDB(user);

  sendResponse<Book>(res, {
    statusCode: 200,
    success: true,
    message: 'Book created successfully',
    data: result,
  });
});

const getSingleBook: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await bookService.getSingleBookFromDB(id);

  if (result === null) {
    sendResponse<Book>(res, {
      statusCode: 404,
      success: false,
      message: `Error: Book with ID ${id} is not found. Please verify the provided ID and try again`,
      data: result,
    });
  } else {
    sendResponse<Book>(res, {
      statusCode: 200,
      success: true,
      message: 'Book retrieved successfully',
      data: result,
    });
  }
});

const getBooksByCategory: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.categoryId;

  const result = await bookService.getBooksByCategoryFromDB(id);

  if (result === null) {
    sendResponse<Book[]>(res, {
      statusCode: 404,
      success: false,
      message: `Error: Book with category ID ${id} is not found. Please verify the provided ID and try again`,
      data: result,
    });
  } else {
    sendResponse<Book[]>(res, {
      statusCode: 200,
      success: true,
      message: 'Book retrieved successfully',
      data: result,
    });
  }
});

const updateBook: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updatedBookData = req.body;

  const result = await bookService.updateBookInDB(id, updatedBookData);

  if (result === null) {
    throw new ApiError(
      404,
      `Error: Book with ID ${id} is not found. Please verify the provided ID and try again`
    );
  } else {
    sendResponse<Book>(res, {
      statusCode: 200,
      success: true,
      message: 'Book updated successfully',
      data: result,
    });
  }
});

const deleteBook: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await bookService.deleteBookFromDB(id);

  if (result === null) {
    throw new ApiError(
      404,
      `Error: Book with ID ${id} is not found. Please verify the provided ID and try again`
    );
  } else {
    sendResponse<Book>(res, {
      statusCode: 200,
      success: true,
      message: 'Book deleted successfully',
      data: result,
    });
  }
});

const getAllBooks: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, bookFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await bookService.getAllBooksFromDB(
    filters,
    paginationOptions
  );

  sendResponse<Book[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Books retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const bookController = {
  createBook,
  getSingleBook,
  getBooksByCategory,
  updateBook,
  deleteBook,
  getAllBooks,
};
