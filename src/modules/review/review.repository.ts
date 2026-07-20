import prisma from "../../config/db.js";

class ReviewRepository {
  async createReview(data: any) {
    await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          bookingId: data.bookingId,
          customerId: data.customerId,
          technicianId: data.technicianId,
          rating: data.rating,
          comment: data.comment,
        },
      });

      const booking = await tx.booking.findUniqueOrThrow({
        where: { id: data.bookingId },
        select: { serviceId: true },
      });

      const stats = await tx.review.aggregate({
        where: {
          booking: {
            serviceId: booking.serviceId,
          },
        },
        _avg: {
          rating: true,
        },
      });

      await tx.service.update({
        where: { id: booking.serviceId },
        data: {
          averageRating: stats._avg.rating ?? 0,
        },
      });

      return review;
    });
  }
}

export default new ReviewRepository();