import prisma from "../../config/db.js";
import type { Prisma } from "../../generated/prisma/client.js";

class BookingRepository {
  async createBooking(data: Prisma.BookingUncheckedCreateInput) {
    const result = await prisma.booking.create({
      data: {
        ...data,
      },
    });
    return result;
  }
}

export default new BookingRepository();
