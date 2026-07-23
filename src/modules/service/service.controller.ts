import type { Request, Response, NextFunction } from "express";
import serviceService from "./service.service.js";

class ServiceController {
  getAllServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await serviceService.getAllServices(req);
        res.status(200).json({
            success: true,
            message: "Services retrieved successfully",
            data: result,
        });
    } catch (error) {
      next(error);
    }
  };
  createService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await serviceService.createService(req);
      res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  updateService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const serviceId = req.params.serviceId as string;
      const data = req.body;
      const result = await serviceService.updateService(userId,serviceId, data);
      res.status(200).json({
        success: true,
        message: "Service updated successfully",
        data: result,
      }); 
    } catch (error) {
      next(error);
    }
  }
}

export default new ServiceController();
