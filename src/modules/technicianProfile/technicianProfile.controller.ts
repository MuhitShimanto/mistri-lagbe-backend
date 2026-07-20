import type { Request, Response } from "express";
import technicianProfileService from "./technicianProfile.service.js";
import ApiError from "../../utils/ApiError.js";
import { BookingStatus } from "../../generated/prisma/enums.js";

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
  getIncomingBookingRequests = async (req: Request, res: Response) => {
    const result = await technicianProfileService.getIncomingBookingRequests(req.user?.id as string);

    res.status(200).json({
      success: true,
      message: "Incoming booking requests retrieved successfully",
      data: result,
    });
  }
  updateRequestedBookingStatus = async (req: Request, res: Response) => {
    const updateStatusData = {
      bookingId: req.params.bookingId as string,
      status: req.body.status as BookingStatus,
      userId: req.user?.id as string,
    }

    const result = await technicianProfileService.updateRequestedBookingStatus(updateStatusData);

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: result,
    });
  }
}

export default new TechnicianProfileController();
