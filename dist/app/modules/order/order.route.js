"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(client_1.UserRole.CUSTOMER), (0, validateRequest_1.default)(order_validation_1.orderValidation.createOrderZodSchema), order_controller_1.orderController.createOrder);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER), order_controller_1.orderController.getSingleOrder);
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER), order_controller_1.orderController.getAllOrders);
exports.orderRoutes = router;
