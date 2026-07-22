import type { Request, Response, NextFunction } from "express";
import userService from "./user.service.js";


class UserController {
    getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = userService.getAllUsers();
            res.status(200).json({
                status: "success",
                message: "Users fetched successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();