import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";

const serviceRoute = Router();


