import prisma from "../../config/db.js";
import { BookingStatus, Role, type Prisma } from "../../generated/prisma/client.js";

class BookingRepository {
  async createBooking(data: Prisma.BookingUncheckedCreateInput) {
    const result = await prisma.booking.create({
      data: {
        ...data,
      },
    });
    return result;
  }
  async getBookingById(id: string) {
    const result = await prisma.booking.findUnique({
      where: { id },
    });
    return result;
  }
  async cancelBooking(id: string) {
    const result = await prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
    return result;
  }
  async getAllBookings() {
    const result = await prisma.booking.findMany();
    return result;
  }
  async updateBookingStatusAfterPayment(bookingId: string, status: BookingStatus) {
    const result = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
    return result;
  }
}

export default new BookingRepository();
