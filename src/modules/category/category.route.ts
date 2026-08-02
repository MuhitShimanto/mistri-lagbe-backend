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
  categoryController.getAllCategories,
);
categoryRouter.patch("/:id", authMiddleware(Role.ADMIN), categoryController.updateCategory);
categoryRouter.delete("/:id", authMiddleware(Role.ADMIN), categoryController.deleteCategory);



export default categoryRouter;
