import type { Request, Response, NextFunction } from "express";
import config from "../config/index.js";
import ApiError from "../utils/ApiError.js";


const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  let statusCode = 500;
  let message = "Internal Server Error";
  let errorDetails: unknown = null;


  
  // Custom application errors
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = err.errorDetails;
  }


  // Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    statusCode = 400;
    message = "Database operation failed";

    errorDetails = {
      code: (err as any).code,
      meta: (err as any).meta,
    };
  }


  // Validation errors (Zod/Joi/etc.)
  if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation failed";

    errorDetails = (err as any).issues;
  }


  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
    ...(config.nodeEnv === "development" && {
      stack: err.stack,
    }),
  });
};


export default globalErrorHandler;