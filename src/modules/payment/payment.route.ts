import { Router } from "express";
import paymentController from "./payment.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";

const paymentRouter = Router();

// Create Payment Intent (Returns the payment gateway URL)
paymentRouter.post("/create-payment-intent", authMiddleware(Role.ADMIN, Role.CUSTOMER),paymentController.createPaymentIntent);
// Check Successful Payment
paymentRouter.post("/verify", paymentController.handlePaymentVerify);
// Check Failed Payment
// paymentRouter.get("/fail", authMiddleware(Role.ADMIN, Role.CUSTOMER), paymentController.handlePaymentFail);
// Check Cancelled Payment
// paymentRouter.get("/cancel", authMiddleware(Role.ADMIN, Role.CUSTOMER), paymentController.handlePaymentCancel);

export default paymentRouter;