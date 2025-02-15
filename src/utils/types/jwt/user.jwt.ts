import { Role } from "@/utils";

export interface IUserJwtPayload {
  id: number;
  roles: Role[];
}
