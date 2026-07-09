import { z } from "zod";


export const createServiceSchema = z.object({
  body: z.object({

    name: z
      .string({
        error: "Service name is required",
      })
      .min(2, "Service name must be at least 2 characters")
      .max(100, "Service name cannot exceed 100 characters"),


    description: z
      .string()
      .max(1000, "Description cannot exceed 1000 characters")
      .optional(),


    price: z
      .number({
        error: "Price is required",
      })
      .positive("Price must be greater than 0"),


    duration: z
      .number()
      .int("Duration must be an integer")
      .positive("Duration must be greater than 0")
      .optional(),


    categoryId: z
      .string({
        error: "Category ID is required",
      })
      .uuid("Invalid category ID"),

  }),
});


export const updateServiceSchema = z.object({
  body: z.object({

    name: z
      .string()
      .min(2)
      .max(100)
      .optional(),


    description: z
      .string()
      .max(1000)
      .optional(),


    price: z
      .number()
      .positive()
      .optional(),


    duration: z
      .number()
      .int()
      .positive()
      .optional(),


    categoryId: z
      .string()
      .uuid("Invalid category ID")
      .optional(),

  }),
});


export type CreateServiceInput = z.infer<
  typeof createServiceSchema
>;


export type UpdateServiceInput = z.infer<
  typeof updateServiceSchema
>;