import type { NextFunction, Request, Response } from 'express';
import authService from './auth.service.js';
import prisma from '../../config/db.js';
import type { User } from '../../generated/prisma/client.js';
import config from '../../config/index.js';

class AuthController {
  register = async (req: Request, res: Response) => {
    const result = await authService.register(req.validated!.body as User);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  };

  login = async (req: Request, res: Response) => {
    const result = await authService.login(req.validated!.body as { email: string; password: string });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: config.jwt.refreshMaxAge * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      const result = await authService.getMe(userId as string);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: Function) => {
    try {
      const result = await authService.refreshToken(req.cookies?.refreshToken);

      // set the new refresh token in the cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: config.jwt.refreshMaxAge * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
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
