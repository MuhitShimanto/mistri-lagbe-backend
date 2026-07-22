import { Router } from "express";
import userController from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";

const userRouter = Router();



userRouter.patch("/:id", userController.updateUser)


/*
=================================
 ADMIN ROUTES
=================================
*/

// View All Users
userRouter.get("/", authMiddleware(Role.ADMIN), userController.getAllUsers);
// Change User Status (ACTIVE/BANNED)
userRouter.patch("/:id/status", authMiddleware(Role.ADMIN), userController.updateUserStatus);

export default userRouter;

