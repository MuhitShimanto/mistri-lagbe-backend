class ReviewRepository {
  async createReview(data: any) {
    await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          bookingId,
          customerId,
          technicianId,
          rating,
          comment,
        },
      });

      const booking = await tx.booking.findUniqueOrThrow({
        where: { id: bookingId },
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
