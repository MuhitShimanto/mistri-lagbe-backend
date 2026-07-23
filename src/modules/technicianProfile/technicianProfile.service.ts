import { BookingStatus } from '../../generated/prisma/enums.js';
import ApiError from '../../utils/ApiError.js';
import authRepository from '../auth/auth.repository.js';
import bookingService from '../booking/booking.service.js';
import technicianProfileRepository from './technicianProfile.repository.js';
import type {
  GetAllTechnicianProfilesInput,
  UpdateAvailabilityInput,
  UpdateTechnicianProfileInput,
} from './technicianProfile.validation.js';

class TechnicianProfileService {

  updateAvailability = async (data: UpdateAvailabilityInput) => {
    if (!data.id) {
      throw new Error('User ID is required');
    }
    const result = await technicianProfileRepository.updateTechnicianAvailability(data);
    return result;
  };

  getAllTechnicianProfile = async (params: GetAllTechnicianProfilesInput) => {
    const result = await technicianProfileRepository.getAllTechnicianProfiles(params);
    // Destructure the result
    const formattedResults = result.map((profile) => {
      const { userId, id: technicianId, bio, experienceYears, hourlyRate, isAvailable, skills, availability, rating, user } = profile;
      return {
        userId,
        technicianId,
        name: user.name,
        email: user.email,
        bio,
        skills,
        rating,
        availability,
        address: user.address,
        city: user.city,
        experienceYears,
        hourlyRate,
        isAvailable,
      };
    });
    return formattedResults;
  };

  getTechnicianProfileById = async (params: any) => {
    const { id } = params;
    if (!id) {
      throw new Error('Technician Profile Not Found');
    }
    const result = await technicianProfileRepository.getTechnicianProfileById(id);
    if (!result) {
      throw new Error('Technician Not Found');
    }
    const userProfile = await authRepository.findUserById(result.userId);
    if (!userProfile) {
      throw new Error('User Not Found');
    }
    const formattedResult = {
      technicianId: result.id,
      name: userProfile.name,
      email: userProfile.email,
      address: userProfile.address,
      city: userProfile.city,
      ...result,
    };
    delete formattedResult.id;
    return formattedResult;
  };

  getIncomingBookingRequests = async (userId: string) => {
    const technicianId = await technicianProfileRepository.findTechnicianIdByUserId(userId);
    if (!technicianId) {
      throw new Error('Technician Profile Not Found');
    }
    const result = await technicianProfileRepository.getIncomingBookingRequests(technicianId);
    return result;
  };

  updateRequestedBookingStatus = async (data: {
    bookingId: string;
    status: BookingStatus;
    userId: string;
  }) => {
    const technicianId = await technicianProfileRepository.findTechnicianIdByUserId(data.userId);
    if (!technicianId) {
      throw new Error('Technician Not Found');
    }
    const booking = await bookingService.getBookingById(data.bookingId, technicianId);
    if(booking.technicianId !== technicianId) {
      throw new ApiError(403, 'You are not authorized to update this booking status');
    }
    // Can change the status to "In Progress" only if the status is "PAID" already
    if (data.status === BookingStatus.IN_PROGRESS) {
      if (booking.status !== BookingStatus.PAID) {
        throw new ApiError(400, 'Cannot update booking status to In Progress unless it is already PAID');
      }
    }
    // Can change the status to "Completed" only if the status is "In Progress" or "PAID" already
    if (data.status === BookingStatus.COMPLETED) {
      if (booking.status !== BookingStatus.IN_PROGRESS && booking.status !== BookingStatus.PAID) {
        throw new ApiError(400, 'Cannot update booking status to Completed unless it is already In Progress or PAID');
      }
    }

    const result = await technicianProfileRepository.updateRequestedBookingStatus({
      bookingId: data.bookingId,
      status: data.status,
      technicianId: technicianId,
    });
    return result;
  };

  updateProfile = async (userId: string, data: Partial<UpdateTechnicianProfileInput>) => {
    const technicianId = await technicianProfileRepository.findTechnicianIdByUserId(userId);
    if (!technicianId) {
      throw new ApiError(404, 'Technician Profile Not Found');
    }
    const result = await technicianProfileRepository.updateTechnicianProfile(technicianId, data);
    return result;
  };
}

export default new TechnicianProfileService();
