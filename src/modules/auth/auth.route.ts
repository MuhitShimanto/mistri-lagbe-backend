import { Router } from "express";
import authController from "./auth.controller.js";
import validateRequest from "../../middlewares/validate.middleware.js";
import {
  getMeValidationSchema,
  loginValidationSchema,
  registerValidationSchema,
  refreshTokenValidationSchema,
} from "./auth.validation.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest(registerValidationSchema),
  authController.register,
);

authRouter.post(
  "/login",
  validateRequest(loginValidationSchema),
  authController.login,
);

authRouter.post("/logout", authController.logout);

authRouter.post(
  "/refresh",
  validateRequest(refreshTokenValidationSchema),
  authController.refreshToken,
);

authRouter.get(
  "/me",
  authMiddleware(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  validateRequest(getMeValidationSchema),
  authController.getMe,
);

export default authRouter;