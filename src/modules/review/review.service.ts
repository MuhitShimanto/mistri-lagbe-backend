import { BookingStatus, type User } from '../../generated/prisma/client.js';
import ApiError from '../../utils/ApiError.js';
import bookingService from '../booking/booking.service.js';
import reviewRepository from './review.repository.js';
import type { CreateReviewInput } from './review.validation.js';

class ReviewService {
  createReview = async (data: CreateReviewInput, user: User) => {
    // Check if the booking belongs to the user and if the booking is completed
    const booking = await bookingService.bookingById(data.bookingId);
    if (!booking || booking.customerId !== user.id || booking.status !== BookingStatus.PAID) {
      throw new ApiError(400, 'Invalid booking ID or booking is not completed');
    }

    const result = await reviewRepository.createReview({
      ...data,
      customerId: booking.customerId,
      technicianId: booking.technicianId,
    });
    return result;
  };
}

export default new ReviewService();
