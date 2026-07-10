import prisma from "../../config/db.js";
import type {
  CreateTechnicianProfileInput,
  UpdateAvailabilityInput,
  UpdateTechnicianProfileInput,
} from "./technicianProfile.validation.js";

class TechnicianProfileRepository {
  async updateTechnicianProfile(data: UpdateTechnicianProfileInput) {
    return prisma.technicianProfile.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
      },
    });
  }
  async updateTechnicianAvailability(data: UpdateAvailabilityInput) {
    return prisma.technicianProfile.update({
      where: {
        id: data.id,
      },
      data: {
        isAvailable: data.body.isAvailable,
      },
    });
  }
  async createTechnicianProfile(userId: string) {
    return prisma.technicianProfile.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
  async findTechnicianIdByUserId(userId: string) {
    const technicianProfile = await prisma.technicianProfile.findUnique({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });
    return technicianProfile?.id || null;
  }
}

export default new TechnicianProfileRepository();
