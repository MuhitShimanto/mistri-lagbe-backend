import type { Request } from "express";
import serviceRepository from "./service.repository.js";
import type { GetServiceInput } from "./service.validation.js";
import technicianProfileRepository from "../technicianProfile/technicianProfile.repository.js";
import type { ServiceUpdateInput } from "../../generated/prisma/models.js";

class serviceService {
    getAllServices = async (data: GetServiceInput) => {
        const result = await serviceRepository.getAllServices(data);
        return result;
    }
    createService = async (data: Request) => {
        const body = data.body;
        const userId = data.user?.id;
        if (!userId) {
            throw new Error("Unauthorized");
        }
        // Find technician Id based on the user Id
        const technicianId = await technicianProfileRepository.findTechnicianIdByUserId(userId);
        if (!technicianId) {
            throw new Error("Unauthorized");
        }
        const result = await serviceRepository.createService({ ...body, technicianId });
        return result;
    }
    updateService = async (userId: string, serviceId: string, data: Partial<ServiceUpdateInput>) => {
        // Check if service belongs to the technician making the request
        const technicianId = await technicianProfileRepository.findTechnicianIdByUserId(userId);
        if (!technicianId) {
            throw new Error("Unauthorized");
        }
        const service = await serviceRepository.getServiceById(serviceId);
        if (!service || service.technicianId !== technicianId) {
            throw new Error("Unauthorized");
        }
        const result = await serviceRepository.updateService(serviceId, data);
        return result;
    }
}

export default new serviceService();