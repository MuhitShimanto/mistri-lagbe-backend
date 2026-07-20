import { z } from 'zod';
import {  PaymentStatus } from '../../generated/prisma/enums.js';

export const createPaymentSchema = z.object({
  body: z.object({
    bookingId: z
      .string({
        error: 'Booking ID is required',
      })
      .uuid('Invalid booking ID'),

    userId: z.string({
      error: 'User ID is required',
    }),

    amount: z
      .number({
        error: 'Amount is required',
      })
      .positive('Amount must be a positive number'),

    status: z.enum(PaymentStatus, {
      error: 'Invalid payment status',
    }),

    meta: z.object({
      val_id: z.string()
    }).optional(),

    provider: z.enum(['STRIPE', 'SSLCOMMERZ'], {
      error: 'Invalid payment provider',
    }),

    transactionId: z.string(),
  }),
});

export const confirmPaymentSchema = z.object({
  body: z.object({
    transactionId: z
      .string({
        error: 'Transaction ID is required',
      })
      .min(1, 'Transaction ID cannot be empty'),
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>['body'];

export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>['body'];
