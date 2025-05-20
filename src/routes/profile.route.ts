import { getMyProfileController } from "@/controllers";
import { authMiddleware } from "@/middlewares";
import { Router } from "express";

const profileRouter = Router();

profileRouter.use(authMiddleware);
profileRouter.get("/me", getMyProfileController);

export default profileRouter;
