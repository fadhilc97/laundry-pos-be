import {
  postCreateLaundryController,
  getMyLaundryController,
  postCreateLaundryConfigController,
} from "@/controllers";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import { Router } from "express";

const laundryRouter = Router();

laundryRouter.use(authMiddleware);

// laundryRouter.use(roleMiddleware(Role.OWNER));
laundryRouter.post(
  "/",
  roleMiddleware(Role.OWNER),
  postCreateLaundryController
);
laundryRouter.get("/me", roleMiddleware(Role.OWNER), getMyLaundryController);

// laundryRouter.use(roleMiddleware(Role.SUPER_ADMIN));
laundryRouter.post(
  "/:id/config",
  roleMiddleware(Role.SUPER_ADMIN),
  postCreateLaundryConfigController
);

export default laundryRouter;
