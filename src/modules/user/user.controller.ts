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
    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await userService.updateUser(req.params.id as string, req.body);
            res.status(200).json({
                status: "success",
                message: "User updated successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
    updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await userService.updateUserStatus(id as string, status);
            res.status(200).json({
                status: "success",
                message: "User status updated successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();