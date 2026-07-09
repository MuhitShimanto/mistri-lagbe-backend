import cors from "cors";
import cookieParser from "cookie-parser";
import express, { type Application, type Request, type Response } from "express";
import globalErrorHandler from "./middlewares/error.middleware.js";
import authRouter from "./modules/auth/auth.route.js";
import categoryRoute from "./modules/category/category.route.js";


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
app.use("/api/v1/categories", categoryRoute);

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