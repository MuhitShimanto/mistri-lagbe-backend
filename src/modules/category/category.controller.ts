import type { Request, Response, NextFunction } from "express";
import categoryRepository from "./category.repository.js";
import categoryService from "./category.service.js";

class CategoryController {
  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await categoryService.createCategory(req.body);

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
      const result = await categoryService.getAllCategories();
      res.status(200).json({
        success: true,
        message: "Categories retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = req.params.id as string;
      const data = req.body;
      const result = await categoryService.updateCategory(categoryId, data);
      res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = req.params.id as string;
      const result = await categoryService.deleteCategory(categoryId);
      res.status(200).json({
        success: true,
        message: "Category deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
