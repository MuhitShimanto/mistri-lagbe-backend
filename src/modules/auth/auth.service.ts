import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';

import { UserStatus } from '../../generated/prisma/enums.js';
import authRepository from './auth.repository.js';
import { DUMMY_PASSWORD_HASH } from './auth.constants.js';
import config from '../../config/index.js';
import type { User } from '../../generated/prisma/client.js';
import ApiError from '../../utils/ApiError.js';
import { email } from 'zod';
import technicianProfileRepository from '../technicianProfile/technicianProfile.repository.js';

class AuthService {
  async register(payload: User) {
    const existing = await authRepository.findUserByEmail(payload.email);

    /**
     * Avoid exposing whether an email already exists.
     */
    if (existing) {
      throw new Error('Unable to create account.');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await authRepository.createUser({
      ...payload,
      password: hashedPassword,
    });

    // If role is technician, create a technician profile
    const technicianProfile = await technicianProfileRepository.createTechnicianProfile(user.id);

    /**
     * Never return password hash.
     */
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    };
  }

  async login(payload: { email: string; password: string }) {
    const email = payload.email.trim().toLowerCase();

    const user = await authRepository.findUserByEmail(email);

    /**
     * Always execute bcrypt.compare().
     *
     * Existing user:
     *   compare with stored password hash
     *
     * Missing user:
     *   compare with dummy hash
     *
     * This prevents timing attacks
     * and user/email enumeration.
     */
    const passwordHash = user?.password ?? DUMMY_PASSWORD_HASH;

    const passwordMatched = await bcrypt.compare(payload.password, passwordHash);

    if (!user || !passwordMatched) {
      throw new Error('Invalid email or password.');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new Error('Account is inactive.');
    }

    if (!config.jwt.secret) {
      throw new Error('JWT secret is not configured.');
    }

    const accessToken = await this.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    // refresh token
    const refreshToken = await this.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      refreshToken,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };
  }
  async refreshToken(token: string) {
    if (!token) {
      throw new ApiError(401, 'Refresh token missing');
    }

    const decoded = await this.verifyRefreshToken(token);

    if (!decoded?.id) {
      console.log(decoded);
      throw new ApiError(401, 'Invalid refresh token');
    }

    const user = await authRepository.findUserById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    const accessToken = await this.generateAccessToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    const newRefreshToken = await this.generateRefreshToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  // helper functions
  async generateAccessToken(payload: { id: string; email: string; role: string }) {
    return jwt.sign(
      {
        sub: payload.id,
        email: payload.email,
        role: payload.role,
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn!,
        issuer: 'your-api',
        audience: 'your-users',
      },
    );
  }
  async generateRefreshToken(payload: { id: string; email: string; role: string }) {
    return jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.refreshExpiresIn!,
        issuer: 'your-api',
        audience: 'your-users',
      },
    );
  }
  async verifyRefreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as {
        id: string;
        email: string;
        role: string;
      };
      return decoded;
    } catch (error) {
      throw new ApiError(401, 'Invalid refresh token');
    }
  }
  async getMe(user_id: string) {
    const user = await authRepository.findUserById(user_id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    const technicianProfileId = await technicianProfileRepository.findTechnicianIdByUserId(user_id);
    const technicianProfile = await technicianProfileRepository.getTechnicianProfileById(
      technicianProfileId ?? '',
    );
    const { id: userId, name, email, phone, role, status, address, city, createdAt, updatedAt } = user;
    if (technicianProfile) {
      const { id: technicianId, bio, experience, hourlyRate, location, isAvailable } = technicianProfile;
      return {
        userId,
        technicianId,
        name,
        email,
        phone,
        address,
        city,
        role,
        bio,
        experience,
        hourlyRate,
        location,
        isAvailable,
        status,
        createdAt,
        updatedAt,
      };
    }
    return {
      userId,
      name,
      email,
      phone,
      role,
      status,
      address,
      city,
      createdAt,
      updatedAt,
    };
  }
}

export default new AuthService();
