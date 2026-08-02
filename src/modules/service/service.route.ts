import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";
import serviceController from "./service.controller.js";

const serviceRouter = Router();

serviceRouter.post("/", authMiddleware(Role.TECHNICIAN), serviceController.createService);
serviceRouter.get("/", serviceController.getAllServices);
serviceRouter.get("/:serviceId", serviceController.getServiceById);
serviceRouter.patch("/:serviceId", authMiddleware(Role.TECHNICIAN), serviceController.updateService);
// serviceRouter.delete("/:serviceId", authMiddleware(Role.TECHNICIAN), serviceController.deleteService);

export default serviceRouter;