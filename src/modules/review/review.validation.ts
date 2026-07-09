import { z } from "zod";


export const createReviewSchema = z.object({
  body: z.object({

    bookingId: z
      .string({
        error: "Booking ID is required",
      })
      .uuid("Invalid booking ID"),


    rating: z
      .number({
        error: "Rating is required",
      })
      .int("Rating must be an integer")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5"),


    comment: z
      .string()
      .max(1000, "Comment cannot exceed 1000 characters")
      .optional(),

  }),
});


export const updateReviewSchema = z.object({
  body: z.object({

    rating: z
      .number()
      .int()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5")
      .optional(),


    comment: z
      .string()
      .max(1000, "Comment cannot exceed 1000 characters")
      .optional(),

  }),
});


export type CreateReviewInput = z.infer<
  typeof createReviewSchema
>;


export type UpdateReviewInput = z.infer<
  typeof updateReviewSchema
>;