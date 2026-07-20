import { BookingStatus } from "../../generated/prisma/enums.js";
import bookingService from "../booking/booking.service.js";
import technicianProfileRepository from "./technicianProfile.repository.js";
import type { GetAllTechnicianProfilesInput, UpdateAvailabilityInput, UpdateTechnicianProfileInput } from "./technicianProfile.validation.js";

class TechnicianProfileService {
    updateProfile = async (data: UpdateTechnicianProfileInput) => {
        if(!data.id) {
            throw new Error("User ID is required");
        }
        const result = await technicianProfileRepository.updateTechnicianProfile(data);
        return result;
    };

    updateAvailability = async (data: UpdateAvailabilityInput) => {
        if(!data.id) {
            throw new Error("User ID is required");
        }
        const result = await technicianProfileRepository.updateTechnicianAvailability(data);
        return result;
    }

    getAllTechnicianProfile = async (params: GetAllTechnicianProfilesInput) => {
        const result = await technicianProfileRepository.getAllTechnicianProfiles(params);
        return result;
    }

    getTechnicianProfileById = async (params: any) => {
        const { id } = params;
        if(!id) {
            throw new Error("Technician Profile Not Found");
        }
        const result = await technicianProfileRepository.getTechnicianProfileById(id);
        return result;
    }

    getIncomingBookingRequests = async (userId: string) => {
        const technicianId = await technicianProfileRepository.findTechnicianIdByUserId(userId);
        if(!technicianId) {
            throw new Error("Technician Profile Not Found");
        }
        const result = await technicianProfileRepository.getIncomingBookingRequests(technicianId);
        return result;
    }

    updateRequestedBookingStatus = async (data: { bookingId: string, status: BookingStatus, userId: string }) => {
        const technicianId = await technicianProfileRepository.findTechnicianIdByUserId(data.userId);
        if(!technicianId) {
            throw new Error("Technician Not Found");
        }
        // Can change the status to "In Progress" only if the status is "PAID" already
        if (data.status === BookingStatus.IN_PROGRESS) {
            const booking = await bookingService.bookingById(data.bookingId);
            if (booking.status !== BookingStatus.PAID) {
                throw new Error("Cannot update booking status to In Progress unless it is already PAID");
            }
        }
        // Can change the status to "Completed" only if the status is "In Progress" or "PAID" already
        if (data.status === BookingStatus.COMPLETED) {
            const booking = await bookingService.bookingById(data.bookingId);
            if (booking.status !== BookingStatus.IN_PROGRESS && booking.status !== BookingStatus.PAID) {
                throw new Error("Cannot update booking status to Completed unless it is already In Progress or PAID");
            }
        }

        const result = await technicianProfileRepository.updateRequestedBookingStatus({
            bookingId: data.bookingId,
            status: data.status,
            technicianId: technicianId,
        });
        return result;
    }

}

export default new TechnicianProfileService();