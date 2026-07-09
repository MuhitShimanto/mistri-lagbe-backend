import prisma from "../../config/db.js"
import type { Category } from "../../generated/prisma/client.js";
import type { createCategoryInput } from "./category.types.js";

class CategoryRepository {
    createCategory = async (data: createCategoryInput) => {
        return prisma.category.create({
            data,
        });
    }
}

export default new CategoryRepository();