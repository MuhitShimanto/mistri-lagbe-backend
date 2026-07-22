import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";
import bookingController from "./booking.controller.js";

const bookingRouter = Router();

// Create Single Booking
bookingRouter.post("/", authMiddleware(Role.CUSTOMER), bookingController.createBooking);
// Cancel Booking (Own Booking + Admin can cancel any booking)
bookingRouter.delete("/:id", authMiddleware(Role.ADMIN, Role.CUSTOMER), bookingController.cancelBooking);

bookingRouter.get("/", authMiddleware(Role.ADMIN), bookingController.getAllBookings);
bookingRouter.get("/:id", authMiddleware(Role.CUSTOMER), bookingController.getBookingById);
// To Do
// bookingRouter.put("/:id", authMiddleware(Role.CUSTOMER), bookingController.updateBooking);
// bookingRouter.delete("/:id", authMiddleware(Role.CUSTOMER), bookingController.deleteBooking);


export default bookingRouter;