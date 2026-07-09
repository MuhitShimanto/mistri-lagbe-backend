import { z } from "zod";


export const createTechnicianProfileSchema = z.object({
  body: z.object({

    bio: z
      .string()
      .max(1000, "Bio cannot exceed 1000 characters")
      .optional(),


    experience: z
      .number({
        error: "Experience must be a number",
      })
      .int("Experience must be an integer")
      .min(0, "Experience cannot be negative")
      .optional(),


    hourlyRate: z
      .number({
        error: "Hourly rate must be a number",
      })
      .positive("Hourly rate must be greater than 0")
      .optional(),


    location: z
      .string()
      .max(255, "Location cannot exceed 255 characters")
      .optional(),

  }),
});


export const updateTechnicianProfileSchema = z.object({
  body: z.object({

    bio: z
      .string()
      .max(1000, "Bio cannot exceed 1000 characters")
      .optional(),


    experience: z
      .number()
      .int("Experience must be an integer")
      .min(0, "Experience cannot be negative")
      .optional(),


    hourlyRate: z
      .number()
      .positive("Hourly rate must be greater than 0")
      .optional(),


    location: z
      .string()
      .max(255)
      .optional(),

  }),
});


export const updateAvailabilitySchema = z.object({
  body: z.object({

    isAvailable: z
      .boolean({
        error: "Availability status must be true or false",
      }),

  }),
});


export type CreateTechnicianProfileInput = z.infer<
  typeof createTechnicianProfileSchema
>;


export type UpdateTechnicianProfileInput = z.infer<
  typeof updateTechnicianProfileSchema
>;


export type UpdateAvailabilityInput = z.infer<
  typeof updateAvailabilitySchema
>;