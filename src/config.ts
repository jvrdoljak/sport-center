import * as dotenv from "dotenv";

dotenv.config();

export const APP_PORT = process.env.APP_PORT || 3000;

export const INITIAL_ADMIN_EMAIL =
	process.env.INITIAL_ADMIN_EMAIL || "admin@sport-center.com";
export const INITIAL_ADMIN_PASSWORD =
	process.env.INITIAL_ADMIN_PASSWORD || "DfYXcM9p0v4EnF9yG3OhXq";

export const DATABASE_HOST = process.env.DATABASE_HOST || "mysql";
export const DATABASE_PORT = parseInt(process.env.DATABASE_PORT || "3306");
export const DATABASE_USERNAME = process.env.DATABASE_USER || "root";
export const DATABASE_PASSWORD =
	process.env.DATABASE_PASSWORD || "0g[~y16Atl,1";
export const DATABASE_NAME = process.env.DATABASE_NAME || "sport_center";

export const JWT_SECRET = process.env.JWT_SECRET || "6S0_YLc4gW_McePERZ1_rHX4";
