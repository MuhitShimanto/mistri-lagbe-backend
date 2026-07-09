import { z } from "zod";


export const createPaymentSchema = z.object({
  body: z.object({

    bookingId: z
      .string({
        error: "Booking ID is required",
      })
      .uuid("Invalid booking ID"),


    method: z
      .enum([
        "CARD",
        "MOBILE_BANKING",
        "CASH",
      ], {
        error: "Invalid payment method",
      }),


    provider: z
      .enum([
        "STRIPE",
        "SSLCOMMERZ",
      ], {
        error: "Invalid payment provider",
      }),

  }),
});


export const confirmPaymentSchema = z.object({
  body: z.object({

    transactionId: z
      .string({
        error: "Transaction ID is required",
      })
      .min(1, "Transaction ID cannot be empty"),

  }),
});


export type CreatePaymentInput = z.infer<
  typeof createPaymentSchema
>;


export type ConfirmPaymentInput = z.infer<
  typeof confirmPaymentSchema
>;