import prisma from "../../config/db.js";
import technicianProfileRepository from "./technicianProfile.repository.js";
import type { UpdateAvailabilityInput, UpdateTechnicianProfileInput } from "./technicianProfile.validation.js";

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
}

export default new TechnicianProfileService();