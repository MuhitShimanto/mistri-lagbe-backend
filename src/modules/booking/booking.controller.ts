import type { Request, Response, NextFunction } from "express";
import bookingService from "./booking.service.js";
import ApiError from "../../utils/ApiError.js";

class BookingController {
  createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await bookingService.createBooking(
        req.body,
        req.user?.id!,
      );
      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
  cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.id) {
        throw new ApiError(400, "Booking ID is required");
      }
      const result = await bookingService.cancelBooking(
        req.params.id as string,
        req.user?.id!,
      );
      res.status(200).json({
        success: true,
        message: "Booking canceled successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new BookingController();
