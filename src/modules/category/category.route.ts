import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";
import categoryController from "./category.controller.js";
import validateRequest from "../../middlewares/validate.middleware.js";
import { createCategorySchema } from "./category.validation.js";

const categoryRouter = Router();

// Admin Routes
categoryRouter.post(
  "/",
  authMiddleware(Role.ADMIN),
  validateRequest(createCategorySchema),
  categoryController.createCategory,
);
categoryRouter.get(
  "/",
  authMiddleware(Role.ADMIN),
  categoryController.getAllCategories,
);

// User Routes

export default categoryRouter;
