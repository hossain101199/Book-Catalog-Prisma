"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const orderedBookZodSchema = zod_1.z.object({
    bookId: zod_1.z.string({ required_error: 'Book ID is required' }),
    quantity: zod_1.z.number({ required_error: 'Quantity is required' }),
});
const createOrderZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z
            .enum([client_1.OrderStatus.pending, client_1.OrderStatus.shipped, client_1.OrderStatus.delivered])
            .default(client_1.OrderStatus.pending),
        orderedBooks: zod_1.z.array(orderedBookZodSchema).min(1),
    }),
});
exports.orderValidation = {
    createOrderZodSchema,
};
