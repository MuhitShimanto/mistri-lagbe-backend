import { BookingStatus } from "../../generated/prisma/enums.js";
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
}

export default new BookingService();
