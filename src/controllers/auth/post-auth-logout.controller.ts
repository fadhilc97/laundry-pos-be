import { Request, Response } from "express";

export function postAuthLogoutController(req: Request, res: Response) {
  res.clearCookie("refreshToken");
  res.json({ message: "Logout successful" });
}
