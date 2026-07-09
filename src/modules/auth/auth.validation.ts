import { z } from "zod";
import { Role } from "../../generated/prisma/enums.js";

export const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.email().toLowerCase(),
    phone: z.string().optional(),
    password: z.string().min(8),
    role: z
      .enum(Object.values(Role) as [string, ...string[]])
      .refine((role) => role !== Role.ADMIN, {
        message: "You cannot register as ADMIN",
      })
      .default(Role.CUSTOMER),
    address: z.string().optional(),
    city: z.string().optional(),
  }),
});

export const loginValidationSchema = z.object({
  body: z.object({
    email: z.email().toLowerCase(),
    password: z.string().min(1),
  }),
});
/**
 * Validate authenticated user payload
 *
 * Comes from JWT middleware:
 * req.user
 */
export const getMeValidationSchema = z.object({
  user: z.object({
    id: z.uuid(),
    email: z.email(),
    role: z.enum(
      Object.values(Role) as [string, ...string[]]
    ),
  }),
});


export const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
});