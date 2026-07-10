import type { Request, Response, NextFunction } from "express";
import categoryRepository from "./category.repository.js";

class CategoryController {
  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await categoryRepository.createCategory(
        req.body,
      );

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
  getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await categoryRepository.getAllCategories();
      res.status(200).json({
        success: true,
        message: "Categories retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
