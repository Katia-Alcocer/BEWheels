import dotenv from 'dotenv';

dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET || 'tu_jwt_secret_super_secreto';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
