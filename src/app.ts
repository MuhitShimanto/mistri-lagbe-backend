import cors from "cors";
import cookieParser from "cookie-parser";
import express, { type Application, type Request, type Response } from "express";
import globalErrorHandler from "./middlewares/error.middleware.js";
import authRouter from "./modules/auth/auth.route.js";
import technicianProfileRouter from "./modules/technicianProfile/technicianProfile.route.js";
import categoryRouter from "./modules/category/category.route.js";
import serviceRouter from "./modules/service/service.route.js";
import bookingRouter from "./modules/booking/booking.route.js";
import paymentRouter from "./modules/payment/payment.route.js";


const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieParser())

// Health Check
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Application Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/technician-profile", technicianProfileRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/payments", paymentRouter);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use(globalErrorHandler);

export default app;