import { generateAccessToken, IUserJwtPayload } from "@/utils";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function postAuthRefreshTokenController(
  req: Request,
  res: Response
) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "No refresh token provided" });
    return;
  }

  try {
    const secret =
      process.env.AUTH_REFRESH_TOKEN_JWT_SECRET ||
      "auth-refresh-token-secret-key";
    const decoded = jwt.verify(refreshToken, secret) as IUserJwtPayload;
    const newAccessToken = generateAccessToken({ id: decoded.id });

    res.status(201).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
}
