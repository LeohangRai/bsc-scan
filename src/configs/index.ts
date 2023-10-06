import dotenv from 'dotenv';
dotenv.config();

export const BSC_SCAN_CONFIGS = {
  API_URL: process.env.BSC_SCAN_API_URL ?? 'https://api.bscscan.com/api',
  API_KEY: process.env.BSC_SCAN_API_KEY ?? ''
};

export const SERVER_CONFIGS = {
  PORT: process.env.SERVER_PORT ?? 3000
};

export const DB_CONFIGS = {
  URL: process.env.DB_URI ?? ''
};
