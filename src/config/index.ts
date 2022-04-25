import { config } from "dotenv";

config();

export const TOKEN = process.env.TOKEN || "";
export const DEVELOPER_ID = process.env.DEVELOPER_ID || "";
