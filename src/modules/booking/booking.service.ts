import { BookingStatus } from '../../generated/prisma/enums.js';
import ApiError from '../../utils/ApiError.js';
import serviceRepository from '../service/service.repository.js';
import bookingRepository from './booking.repository.js';
import type { CreateBookingInput } from './booking.validation.js';

class BookingService {
  createBooking = async (body: CreateBookingInput, userId: string) => {
    const serviceDetails = await serviceRepository.getServiceById(body.serviceId);
    if (!serviceDetails) {
      throw new ApiError(404, 'Service not found');
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
      throw new ApiError(404, 'Booking not found');
    }
    if (booking.customerId !== userId) {
      throw new ApiError(403, 'Unauthorized');
    }
    if (booking.status !== BookingStatus.REQUESTED) {
      throw new ApiError(400, "Only bookings with status 'REQUESTED' can be canceled");
    }
    const result = await bookingRepository.cancelBooking(bookingId);
    return result;
  };
  getBookingById = async (booking_id: string, userId: string) => {
    const booking = await bookingRepository.getBookingById(booking_id);
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }
    if (booking.customerId !== userId && booking.technicianId !== userId) {
      throw new ApiError(400, 'Invalid booking or user not authorized');
    }
    const { id, ...bookingData } = booking;
    return { bookingId: booking.id, ...bookingData };
  };
  getAllBookings = async () => {
    const bookings = await bookingRepository.getAllBookings();
    return bookings;
  };
  updateBookingStatusAfterPayment = async (bookingId: string, status: BookingStatus) => {
    const result = await bookingRepository.updateBookingStatusAfterPayment(bookingId, status);
    return result;
  };
}

export default new BookingService();
