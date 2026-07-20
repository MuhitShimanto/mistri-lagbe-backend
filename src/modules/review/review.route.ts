import { Router } from "express";
import reviewController from "./review.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";

const reviewRouter = Router();

reviewRouter.post("/", authMiddleware(Role.CUSTOMER), reviewController.createReview);


export default reviewRouter;