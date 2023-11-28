"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const category_controller_1 = require("./category.controller");
const category_validation_1 = require("./category.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(category_validation_1.categoryValidation.createCategoryZodSchema), category_controller_1.categoryController.createCategory);
router.get('/:id', category_controller_1.categoryController.getSingleCategory);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(category_validation_1.categoryValidation.updateCategoryZodSchema), category_controller_1.categoryController.updateCategory);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), category_controller_1.categoryController.deleteCategory);
router.get('/', category_controller_1.categoryController.getAllCategories);
exports.categoryRoutes = router;
