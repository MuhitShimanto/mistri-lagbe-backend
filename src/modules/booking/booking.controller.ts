import type { Request, Response, NextFunction } from "express";
import bookingService from "./booking.service.js";

class BookingController {
  createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await bookingService.createBooking(req.body, req.user?.id!);
      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new BookingController();
