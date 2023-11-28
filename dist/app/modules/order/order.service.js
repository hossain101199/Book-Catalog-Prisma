"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const order_constant_1 = require("./order.constant");
const createOrderInDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createdOrder = yield prisma_1.default.order.create({
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
});
const getSingleOrderFromDB = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    if (user.role === client_1.UserRole.CUSTOMER) {
        result = yield prisma_1.default.order.findUnique({
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
            throw new ApiError_1.default(401, 'You are not authorized');
        }
    }
    else {
        result = yield prisma_1.default.order.findUnique({
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
});
const getAllOrdersFromDB = (filters, paginationOptions, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: order_constant_1.orderSearchableFields.map(field => ({
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
    let whereConditions;
    if (user.role === client_1.UserRole.CUSTOMER) {
        whereConditions =
            andConditions.length > 0
                ? {
                    AND: [...andConditions, { userId: user.id }],
                }
                : { userId: user.id };
    }
    else {
        whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield prisma_1.default.order.findMany({
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
    const total = yield prisma_1.default.order.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.orderService = {
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
