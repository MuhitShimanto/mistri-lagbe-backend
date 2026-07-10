import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";
import technicianProfileController from "./technicianProfile.controller.js";

const technicianProfileRouter = Router();

// Technician Single Profile
technicianProfileRouter.get(
  "/:id",
  technicianProfileController.getTechnicianProfileById,
)
// Technician All Profiles
technicianProfileRouter.get(
  "/",
  technicianProfileController.getAllTechnicianProfile,
)
// Technician Update Profile
technicianProfileRouter.put(
  "/",
  authMiddleware(Role.TECHNICIAN),
  technicianProfileController.updateProfile,
);
// Technician Update Availability
technicianProfileRouter.put(
    "/availability",
    authMiddleware(Role.TECHNICIAN),
    technicianProfileController.updateAvailability,
)

export default technicianProfileRouter;
