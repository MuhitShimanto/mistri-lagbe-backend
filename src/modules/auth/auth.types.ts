import { Role } from "../../generated/prisma/enums.js";

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}