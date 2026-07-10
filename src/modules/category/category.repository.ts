import prisma from "../../config/db.js"
import type { createCategoryInput } from "./category.types.js";

class CategoryRepository {
    createCategory = async (data: createCategoryInput) => {
        return prisma.category.create({
            data,
        });
    }
    getAllCategories = async () => {
        return prisma.category.findMany();
    }
}

export default new CategoryRepository();