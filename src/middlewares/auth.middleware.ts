import { IUserJwtPayload, IAuthRequest } from "@/utils";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const secret =
      process.env.AUTH_ACCESS_TOKEN_JWT_SECRET ||
      "auth-access-token-secret-key";
    const decoded = jwt.verify(token, secret) as IUserJwtPayload;
    req.userId = decoded.id;
    req.userRoles = decoded.roles;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}
