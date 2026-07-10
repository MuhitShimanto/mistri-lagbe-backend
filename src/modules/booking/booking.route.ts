import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";
import bookingController from "./booking.controller.js";

const bookingRouter = Router();

bookingRouter.post("/", authMiddleware(Role.CUSTOMER), bookingController.createBooking);

// To Do
// bookingRouter.get("/", authMiddleware(Role.CUSTOMER), bookingController.getAllBookings);
// bookingRouter.get("/:id", authMiddleware(Role.CUSTOMER), bookingController.getBookingById);
// bookingRouter.put("/:id", authMiddleware(Role.CUSTOMER), bookingController.updateBooking);
// bookingRouter.delete("/:id", authMiddleware(Role.CUSTOMER), bookingController.deleteBooking);


export default bookingRouter;