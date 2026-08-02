import prisma from "../../config/db.js"
import type { createCategoryInput } from "./category.types.js";
import type { UpdateCategoryInput } from "./category.validation.js";

class CategoryRepository {
    createCategory = async (data: createCategoryInput) => {
        return prisma.category.create({
            data,
        });
    }
    getAllCategories = async () => {
        return prisma.category.findMany({
            omit: {
                createdAt: true,
                updatedAt: true,
            }
        });
    }
    updateCategory = async (id: string, data: Partial<UpdateCategoryInput>) => {
        return prisma.category.update({
            where: { id },
            data,
        });
    }
    deleteCategory = async (id: string) => {
        return prisma.category.delete({
            where: { id },
        });
    }
    getCategoryById = async (id: string) => {
        return prisma.category.findUnique({
            where: { id },
        });
    }
}

export default new CategoryRepository();