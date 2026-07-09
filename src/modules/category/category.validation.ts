import { z } from "zod";


export const createCategorySchema = z.object({
  body: z.object({

    name: z
      .string({
        error: "Category name is required",
      })
      .min(2, "Category name must be at least 2 characters")
      .max(100, "Category name cannot exceed 100 characters"),


    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),


    image: z
      .url("Image must be a valid URL")
      .optional(),

  }),
});


export const updateCategorySchema = z.object({
  body: z.object({

    name: z
      .string()
      .min(2, "Category name must be at least 2 characters")
      .max(100, "Category name cannot exceed 100 characters")
      .optional(),


    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),


    image: z
      .url("Image must be a valid URL")
      .optional(),

  }),
});


export type CreateCategoryInput = z.infer<
  typeof createCategorySchema
>;


export type UpdateCategoryInput = z.infer<
  typeof updateCategorySchema
>;