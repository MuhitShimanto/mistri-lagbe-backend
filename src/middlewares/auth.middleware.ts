import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { Role } from "../generated/prisma/enums.js";
import config from "../config/index.js";
import ApiError from "../utils/ApiError.js";

export const authMiddleware = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Unauthorized: Please Login to access the resource.");
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token as string,
        config.jwt.secret,
      ) as JwtPayload;

      req.user = {
        id: decoded.sub as string,
        email: decoded.email as string,
        role: decoded.role as Role,
      };

      // Role checking
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        throw new ApiError(403, "You do not have permission to access this resource");
      }

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        next(error);
      } else {
        next(new ApiError(401, "Unauthorized"));
      }
    }
  };
};