import { z } from "zod";
import { BookingStatus } from "../../generated/prisma/browser.js";

export const createBookingSchema = z.object({
  body: z.object({
    technicianId: z.string(),

    serviceId: z.string(),

    bookingDate: z.coerce.date(),

    address: z.string().trim().min(5).max(255),

    note: z.string().trim().max(1000).optional(),
  }),
});

export const updateBookingSchema = z.object({
  params: z.object({
    id: z.string("Invalid booking ID"),
  }),

  body: z.object({
    customerId: z.string().optional(),

    technicianId: z.string().optional(),

    serviceId: z.string().optional(),

    bookingDate: z.coerce.date().optional(),

    address: z.string().trim().min(5).max(255).optional(),

    note: z.string().trim().max(1000).optional(),

    status: z.enum(BookingStatus).optional(),
  }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>["body"];

export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;