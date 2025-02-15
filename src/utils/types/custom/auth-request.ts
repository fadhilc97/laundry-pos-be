import { type Request } from "express";
import { Role } from "@/utils";

export interface IAuthRequest extends Request {
  userId?: number;
  userRoles?: Role[];
}
