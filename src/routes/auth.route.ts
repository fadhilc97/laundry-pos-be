import {
  postAuthLoginController,
  postAuthRefreshTokenController,
  postAuthLogoutController,
} from "@/controllers";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", postAuthLoginController);
authRouter.post("/refresh-token", postAuthRefreshTokenController);
authRouter.post("/logout", postAuthLogoutController);

export default authRouter;
