import { z } from "zod";


export const createUserSchema = z.object({
  body: z.object({

    name: z
      .string({
        error: "Name is required",
      })
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),


    email: z
      .string({
        error: "Email is required",
      })
      .email("Invalid email format"),


    phone: z
      .string({
        error: "Phone must be a string",
      })
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number cannot exceed 15 characters")
      .optional(),


    password: z
      .string({
        error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),


    role: z
      .enum([
        "CUSTOMER",
        "TECHNICIAN",
        "ADMIN",
      ])
      .default("CUSTOMER"),


    address: z
      .string()
      .max(255, "Address cannot exceed 255 characters")
      .optional(),


    city: z
      .string()
      .max(100, "City cannot exceed 100 characters")
      .optional(),

  }),
});