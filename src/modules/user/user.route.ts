import { Router } from "express";
import userController from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";

const userRouter = Router();

userRouter.get("/", authMiddleware(Role.ADMIN), userController.getAllUsers);

export default userRouter;

