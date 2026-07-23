import prisma from '../../config/db.js';
import { BookingStatus } from '../../generated/prisma/browser.js';
import type {
  CreateTechnicianProfileInput,
  GetAllTechnicianProfilesInput,
  UpdateAvailabilityInput,
  UpdateTechnicianProfileInput,
} from './technicianProfile.validation.js';

class TechnicianProfileRepository {
  async updateTechnicianProfile(technicianId: string, data: Partial<UpdateTechnicianProfileInput>) {
    const filteredData = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));

    return prisma.technicianProfile.update({
      where: {
        id: technicianId,
      },
      data: filteredData,
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
  async getAllTechnicianProfiles(params: GetAllTechnicianProfilesInput) {
    const { sortBy, location, category, isAvailable } = params;

    return prisma.technicianProfile.findMany({
      where: {
        ...(location && {
          location: {
            contains: location,
            mode: 'insensitive',
          },
        }),

        ...(isAvailable !== undefined && {
          isAvailable,
        }),

        // user related to this technician profile should not contain status banned
        user: {
          status: {
            not: 'BANNED',
          },
        },

        ...(category && {
          services: {
            some: {
              category: {
                name: category,
              },
            },
          },
        }),
      },

      include: {
        user: {
          select: {
            name: true,
            email: true,
            address: true,
            city: true,
          },
        }
      },

      orderBy: sortBy
        ? {
            [sortBy]: 'desc',
          }
        : {
            createdAt: 'desc',
          },
    });
  }
  async getTechnicianProfileById(id: string) {
    return prisma.technicianProfile.findUnique({
      where: {
        id,
      }
    });
  }
  async getIncomingBookingRequests(technicianId: string) {
    return prisma.booking.findMany({
      where: {
        technicianId,
        status: BookingStatus.REQUESTED,
      },
    });
  }
  async updateRequestedBookingStatus(data: { bookingId: string; status: string; technicianId: string }) {
    return prisma.booking.update({
      where: {
        id: data.bookingId,
      },
      data: {
        status: data.status as BookingStatus,
      },
    });
  }
}

export default new TechnicianProfileRepository();
