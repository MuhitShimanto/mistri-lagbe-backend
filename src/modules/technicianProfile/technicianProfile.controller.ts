import type { Request, Response } from "express";
import technicianProfileService from "./technicianProfile.service.js";
import ApiError from "../../utils/ApiError.js";

class TechnicianProfileController {
  updateProfile = async (req: Request, res: Response) => {
    const result = await technicianProfileService.updateProfile({
        ...req.body,
        id: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  };
  updateAvailability = async (req: Request, res: Response) => {
    const result = await technicianProfileService.updateAvailability({
        ...req.body,
        id: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "Availability updated successfully",
      data: result,
    });
  }
  getAllTechnicianProfile = async (req: Request, res: Response) => {
    const result = await technicianProfileService.getAllTechnicianProfile(req.params);

    res.status(200).json({
      success: true,
      message: "Technician profiles retrieved successfully",
      data: result,
    });
  }
  getTechnicianProfileById = async (req: Request, res: Response) => {
    const result = await technicianProfileService.getTechnicianProfileById(req.params);

    res.status(200).json({
      success: true,
      message: "Technician profile retrieved successfully",
      data: result,
    });
  }
}

export default new TechnicianProfileController();
