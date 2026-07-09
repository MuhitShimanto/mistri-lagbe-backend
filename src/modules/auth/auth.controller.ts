import type { Request, Response } from "express";
import authService from "./auth.service.js";
import prisma from "../../config/db.js";
import type { User } from "../../generated/prisma/client.js";
import config from "../../config/index.js";

class AuthController {
  register = async (req: Request, res: Response) => {
    const result = await authService.register(req.validated!.body as User);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  };

  login = async (req: Request, res: Response) => {
    const result = await authService.login(req.validated!.body as { email: string; password: string });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: config.jwt.refreshMaxAge * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  };

  getMe = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          address: true,
          city: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch user details",
      });
    }
  };

  refreshToken = async (req: Request, res: Response, next: Function) => {
  try {
    const result = await authService.refreshToken(req.cookies?.refreshToken);

    // set the new refresh token in the cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: config.jwt.refreshMaxAge * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
}

export default new AuthController();
