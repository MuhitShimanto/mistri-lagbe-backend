import type { Request } from "express";
import serviceRepository from "./service.repository.js";
import type { GetServiceInput } from "./service.validation.js";
import technicianProfileRepository from "../technicianProfile/technicianProfile.repository.js";
import type { ServiceUpdateInput } from "../../generated/prisma/models.js";
import ApiError from "../../utils/ApiError.js";
import technicianProfileService from "../technicianProfile/technicianProfile.service.js";
import categoryService from "../category/category.service.js";

class serviceService {
    getAllServices = async (data: GetServiceInput) => {
        console.log(data);
        const result = await serviceRepository.getAllServices(data);
        const formattedResults = await Promise.all(result.map(async (service) => {
            const user = await technicianProfileService.getUserProfileByTechnicianId({ id: service.technicianId });
            const reviewCount  = await serviceRepository.getReviewCountByServiceId(service.id);
            const categoryObj = await categoryService.getCategoryById(service.categoryId);
            const category = categoryObj ? categoryObj.name : null;
            return {
                ...service,
                category,
                reviewCount,
                technician: {
                    name: user.name,
                    location: user.city,
                    avatarUrl: user.avatarUrl,
                }
            };
        }))
        return formattedResults;
    }
    createService = async (data: Request) => {
        const body = data.body;
        const userId = data.user?.id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }
        // Find technician Id based on the user Id
        const technicianId = await technicianProfileRepository.findTechnicianIdByUserId(userId);
        if (!technicianId) {
            throw new ApiError(401, "Unauthorized");
        }
        const result = await serviceRepository.createService({ ...body, technicianId });
        return result;
    }
    updateService = async (userId: string, serviceId: string, data: Partial<ServiceUpdateInput>) => {
        // Check if service belongs to the technician making the request
        const technicianId = await technicianProfileRepository.findTechnicianIdByUserId(userId);
        if (!technicianId) {
            throw new ApiError(401, "Unauthorized");
        }
        const service = await serviceRepository.getServiceById(serviceId);
        if (!service || service.technicianId !== technicianId) {
            throw new ApiError(401, "Unauthorized");
        }
        const result = await serviceRepository.updateService(serviceId, data);
        return result;
    }
    getServiceById = async (serviceId: string) => {
        const service = await serviceRepository.getServiceById(serviceId);
        if (!service) {
            throw new ApiError(404, "Service not found");
        }
        const user = await technicianProfileService.getUserProfileByTechnicianId({ id: service.technicianId });
        const technicianProfile = await technicianProfileRepository.getTechnicianProfileById(service.technicianId);
        const reviewCount  = await serviceRepository.getReviewCountByServiceId(service.id);
        const categoryObj = await categoryService.getCategoryById(service.categoryId);
        const category = categoryObj ? categoryObj.name : null;
        // Put out the reviews out of bookings and make a new array of reviews to be sent in the response
        const reviews = service.bookings.map((booking) => booking.review).filter((review): review is NonNullable<typeof review> => !!review) || [];
        return {
            ...service,
            category,
            reviewCount,
            reviews,
            technician: {
                name: user.name,
                location: user.city,
                avatarUrl: user.avatarUrl,
                memberSince: technicianProfile?.createdAt || user.createdAt,
                rating: technicianProfile?.rating || 0,
            }
        };
    }
}

export default new serviceService();