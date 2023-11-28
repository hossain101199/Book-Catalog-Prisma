"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.get('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.userController.getSingleUser);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(user_validation_1.userValidation.updateUserZodSchema), user_controller_1.userController.updateUser);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.userController.deleteUser);
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.userController.getAllUsers);
exports.userRoutes = router;
