import dotenv from 'dotenv';
import type { SignOptions } from 'jsonwebtoken';

dotenv.config({
  path: '.env',
});

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    console.error(`❌ ${name} is not defined in the environment variables.`);
    process.exit(1);
  }

  return value;
}

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  appUrl: process.env.APP_URL || '',
  databaseUrl: requireEnv('DATABASE_URL'),
  frontendUrl: process.env.FRONTEND_URL || '',

  // ==================================================
  // Authentication
  // ==================================================
  jwt: {
    secret: requireEnv('JWT_SECRET'),
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'],
    accessMaxAge: Number(process.env.JWT_ACCESS_MAX_AGE) || 7,

    refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '30d') as SignOptions['expiresIn'],
    refreshMaxAge: Number(process.env.JWT_REFRESH_MAX_AGE) || 30,
  },
  // Payment Gateway
  sslCommerz: {
    store_id: process.env.SSLCOMMERZ_STORE_ID || '',
    store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD || '',
    is_live: process.env.SSLCOMMERZ_IS_LIVE === 'true',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
  },
} as const;

export default config;
