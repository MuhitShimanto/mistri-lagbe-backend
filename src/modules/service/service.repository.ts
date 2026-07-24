import prisma from "../../config/db.js";
import type {
  CreateServiceInput,
  GetServiceInput,
} from "./service.validation.js";
import { Prisma } from "../../generated/prisma/client.js"; // Import Prisma types for safety
import type { ServiceUpdateInput } from "../../generated/prisma/models.js";

class serviceRepository {
  async getAllServices(data: GetServiceInput) {
    // 1. Destructure with default values to fix the 'undefined' math errors
    const {
      sortBy,
      order = "desc",
      page = 1,
      limit = 10,
      category,
      location,
      rating,
    } = data;

    // 2. Build a dynamic WHERE clause
    // Using Prisma's auto-generated types ensures strict type safety
    const where: Prisma.ServiceWhereInput = {};

    if (category) {
      // NOTE: If 'category' is a relation table, you might need to use
      // categoryId: category OR category: { name: category }
      where.categoryId = category;
    }

    if (location) {
      // Using 'contains' makes location search much more flexible for users
      where.technicianId = {
        contains: location,
        mode: "insensitive", // Case-insensitive search
      };
    }

    if (rating) {
      // For ratings, users usually want services "greater than or equal to" a number
      where.bookings = {
        some: {
          review: {
            rating: {
              gte: Number(rating),
            },
          },
        },
      };
    }

    // 3. Build a dynamic OrderBy object to fix the type mismatch
    const orderBy: Prisma.ServiceOrderByWithRelationInput = sortBy
      ? { [sortBy]: order }
      : { averageRating: "desc" }; // Default to sorting by highest rating

    // 4. Safe math operations
    const skip = (Number(page) - 1) * Number(limit);

    const result = await prisma.service.findMany({
      where,
      orderBy,
      skip,
      take: Number(limit),
    });

    return result;
  }
  async createService(data: CreateServiceInput) {
    const result = await prisma.service.create({
      data: {
        name: data.name,
        price: data.price,
        categoryId: data.categoryId,
        technicianId: data.technicianId,

        ...(data.description !== undefined && {
          description: data.description,
        }),

        ...(data.duration !== undefined && {
          duration: data.duration,
        }),
      },
    });
    return result;
  }
  async getServiceById(id: string) {
    const result = await prisma.service.findUnique({
      where: {
        id,
      },
    });
    return result;
  }
  async updateService(serviceId: string, data: Partial<ServiceUpdateInput>) {
    // Remove the null and undefined values from the data object to prevent Prisma errors
    const cleanedData: Partial<ServiceUpdateInput> = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== null && value !== undefined)
    );
    
    const result = await prisma.service.update({
      where: {
        id: serviceId,
      },
      data: cleanedData,
    });
    return result;
  }
}

export default new serviceRepository();
