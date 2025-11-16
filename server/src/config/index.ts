import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

export const DB = process.env.DB!;
export const PORT = parseInt(process.env.PORT!);
export const JWT_KEY = process.env.JWT_KEY!;
export const FRONTEND_URL = process.env.FRONTEND_URL!;

export const resend = new Resend(process.env.RESEND_API_KEY as string);
