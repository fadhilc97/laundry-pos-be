import { IUserJwtPayload, IAuthRequest } from "@/utils";
import { db } from "@/services";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { UserLaundry } from "@/schemas";

export async function authMiddleware(
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.clearCookie("refreshToken");
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

    const userLaundry = await db.query.UserLaundry.findFirst({
      where: eq(UserLaundry.userId, decoded.id),
      columns: { isActive: true },
    });

    if (!userLaundry?.isActive) {
      res.status(403).json({ message: "You're inactive" });
      return;
    }

    next();
  } catch (error) {
    res.clearCookie("refreshToken");
    res.status(401).json({ message: "Unauthorized" });
  }
}
