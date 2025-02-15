import { IAuthRequest, Role } from "@/utils";
import { NextFunction, Response } from "express";

export function roleMiddleware(...roles: Role[]) {
  return function (req: IAuthRequest, res: Response, next: NextFunction) {
    const userRoles = req.userRoles;

    const isAccessible = userRoles?.some((userRole) =>
      roles.includes(userRole)
    );

    if (!isAccessible) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
}
