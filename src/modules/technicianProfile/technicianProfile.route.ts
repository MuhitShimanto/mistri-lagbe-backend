import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { Role } from '../../generated/prisma/enums.js';
import technicianProfileController from './technicianProfile.controller.js';

const technicianProfileRouter = Router();

// Technician Read Own Incoming Booking Requests
technicianProfileRouter.get(
  '/bookings',
  authMiddleware(Role.TECHNICIAN),
  technicianProfileController.getIncomingBookingRequests,
);
// Accept or Reject Booking Request
technicianProfileRouter.patch('/bookings/:bookingId', authMiddleware(Role.TECHNICIAN), technicianProfileController.updateRequestedBookingStatus);
// Technician Update Availability
technicianProfileRouter.put(
  '/availability',
  authMiddleware(Role.TECHNICIAN),
  technicianProfileController.updateAvailability,
);
// Technician Single Profile
technicianProfileRouter.get('/:id', technicianProfileController.getTechnicianProfileById);
// Technician All Profiles
technicianProfileRouter.get('/', technicianProfileController.getAllTechnicianProfile);
// Technician Update Profile
technicianProfileRouter.put('/', authMiddleware(Role.TECHNICIAN), technicianProfileController.updateProfile);


export default technicianProfileRouter;
