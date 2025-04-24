import { Request, Response } from "express";

export function postAuthLogoutController(req: Request, res: Response) {
  if (!req.cookies?.refreshToken) {
    res.status(200).json({ message: "Logout successful" });
    return;
  }
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logout successful" });
}
