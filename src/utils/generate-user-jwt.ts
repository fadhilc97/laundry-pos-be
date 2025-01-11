import jwt from "jsonwebtoken";
import { IUserJwtPayload } from "./types";

export function generateAccessToken(
  payload: IUserJwtPayload,
  expiryTime: string = "15m"
) {
  const secret =
    process.env.AUTH_ACCESS_TOKEN_JWT_SECRET || "auth-access-token-secret-key";

  return jwt.sign(payload, secret, { expiresIn: expiryTime });
}

export function generateRefreshToken(
  payload: IUserJwtPayload,
  expiryTime: string = "1h"
) {
  const secret =
    process.env.AUTH_REFRESH_TOKEN_JWT_SECRET ||
    "auth-refresh-token-secret-key";

  return jwt.sign(payload, secret, { expiresIn: expiryTime });
}
