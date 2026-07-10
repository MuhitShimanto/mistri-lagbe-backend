import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";
import technicianProfileController from "./technicianProfile.controller.js";

const technicianProfileRouter = Router();

technicianProfileRouter.get(
  "/",
  technicianProfileController.getAllTechnicianProfile,
)
technicianProfileRouter.put(
  "/",
  authMiddleware(Role.TECHNICIAN),
  technicianProfileController.updateProfile,
);

technicianProfileRouter.put(
    "/availability",
    authMiddleware(Role.TECHNICIAN),
    technicianProfileController.updateAvailability,
)

export default technicianProfileRouter;
