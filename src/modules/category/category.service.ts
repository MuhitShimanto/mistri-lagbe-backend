import categoryRepository from "./category.repository.js";
import type { createCategoryInput } from "./category.types.js";
import type { UpdateCategoryInput } from "./category.validation.js";

class CategoryService {
    createCategory = async (data: createCategoryInput) => {
        const result = await categoryRepository.createCategory(data);
        return result;
    }
    getAllCategories = async () => {
        const result = await categoryRepository.getAllCategories();
        return result;
    }
    updateCategory = async (id: string, data: Partial<UpdateCategoryInput>) => {
        const result = await categoryRepository.updateCategory(id, data);
        return result;
    }
    deleteCategory = async (id: string) => {
        const result = await categoryRepository.deleteCategory(id);
        return result;
    }
    getCategoryById = async (id: string) => {
        const result = await categoryRepository.getCategoryById(id);
        return result;
    }
}

export default new CategoryService();