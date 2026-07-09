import { z } from "zod";


export const createBookingSchema = z.object({
  body: z.object({

    serviceId: z
      .string({
        error: "Service ID is required",
      })
      .uuid("Invalid service ID"),


    technicianId: z
      .string({
        error: "Technician ID is required",
      })
      .uuid("Invalid technician ID"),


    bookingDate: z
      .string({
        error: "Booking date is required",
      })
      .datetime("Invalid booking date format"),


    address: z
      .string({
        error: "Address is required",
      })
      .min(5, "Address must be at least 5 characters")
      .max(255, "Address cannot exceed 255 characters"),


    note: z
      .string()
      .max(500, "Note cannot exceed 500 characters")
      .optional(),

  }),
});


export const updateBookingSchema = z.object({
  body: z.object({

    bookingDate: z
      .string()
      .datetime("Invalid booking date format")
      .optional(),


    address: z
      .string()
      .min(5)
      .max(255)
      .optional(),


    note: z
      .string()
      .max(500)
      .optional(),

  }),
});


export type CreateBookingInput = z.infer<
  typeof createBookingSchema
>;


export type UpdateBookingInput = z.infer<
  typeof updateBookingSchema
>;