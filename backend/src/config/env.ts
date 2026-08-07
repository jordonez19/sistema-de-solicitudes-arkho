import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4005', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgres://arkho_user:arkho_password@localhost:5439/arkho_db',
  corsOrigin: process.env.CORS_ORIGIN || '*'
};
