import { Router } from "express";
import paymentController from "./payment.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";

const paymentRouter = Router();

// Create Payment Intent (Returns the payment gateway URL)
paymentRouter.post("/create-payment-intent", authMiddleware(Role.ADMIN, Role.CUSTOMER),paymentController.createPaymentIntent);
// Check Successful Payment
paymentRouter.post("/verify", paymentController.handlePaymentVerify);
// Get Payment History for a User
paymentRouter.get("/transactions", authMiddleware(Role.ADMIN, Role.CUSTOMER), paymentController.getPaymentHistoryByUserId);
// Get Payment Details by Transaction ID
paymentRouter.get("/transactions/:transactionId", authMiddleware(Role.ADMIN, Role.CUSTOMER), paymentController.getPaymentByTransactionId);

export default paymentRouter;