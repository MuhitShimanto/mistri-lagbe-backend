import type { BookingStatus } from "../../generated/prisma/enums.js";
import paymentController from "../payment/payment.controller.js";
import paymentService from "../payment/payment.service.js";
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
        const result = await technicianProfileRepository.updateRequestedBookingStatus({
            bookingId: data.bookingId,
            status: data.status,
            technicianId: technicianId,
        });
        return result;
    }

}

export default new TechnicianProfileService();