import { BookingStatus } from "../../generated/prisma/enums.js";
import ApiError from "../../utils/ApiError.js";
import serviceRepository from "../service/service.repository.js";
import bookingRepository from "./booking.repository.js";
import type { CreateBookingInput } from "./booking.validation.js";

class BookingService {
  createBooking = async (body: CreateBookingInput, userId: string) => {
    const serviceDetails = await serviceRepository.getServiceById(
      body.serviceId,
    );
    if (!serviceDetails) {
      throw new Error("Service not found");
    }
    const platformFee = serviceDetails.price * 0.0;
    const discount = serviceDetails.price * 0.0;
    const finalPricing = serviceDetails.price + platformFee - discount;
    const bookingData = {
      ...body,
      note: body.note ?? null,
      customerId: userId,
      bookingDate: new Date(),
      status: BookingStatus.REQUESTED,
      totalAmount: finalPricing,
    };
    const result = await bookingRepository.createBooking(bookingData);
    return result;
  };
  cancelBooking = async (bookingId: string, userId: string) => {
    const booking = await bookingRepository.getBookingById(bookingId);
    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }
    if (booking.customerId !== userId) {
      throw new ApiError(403, "Unauthorized");
    }
    if (booking.status !== BookingStatus.REQUESTED) {
        throw new ApiError(400, "Only bookings with status 'REQUESTED' can be canceled");
    }
    const result = await bookingRepository.cancelBooking(bookingId);
    return result;
  }
  bookingById = async (bookingId: string) => {
    const booking = await bookingRepository.getBookingById(bookingId);
    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }
    return booking;
  }
}

export default new BookingService();
