import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: "admin" | "user";
  };
  file?: Express.Multer.File;
}
