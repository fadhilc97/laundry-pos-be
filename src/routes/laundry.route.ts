import {
  postCreateLaundryController,
  getMyLaundryController,
  postCreateLaundryConfigController,
  putUpdateLaundryConfigController,
} from "@/controllers";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import { Router } from "express";

const laundryRouter = Router();

laundryRouter.use(authMiddleware);
laundryRouter.post(
  "/",
  roleMiddleware(Role.OWNER),
  postCreateLaundryController
);
laundryRouter.get("/me", roleMiddleware(Role.OWNER), getMyLaundryController);
laundryRouter.post(
  "/:id/config",
  roleMiddleware(Role.SUPER_ADMIN),
  postCreateLaundryConfigController
);
laundryRouter.put(
  "/:id/config",
  roleMiddleware(Role.SUPER_ADMIN),
  putUpdateLaundryConfigController
);

export default laundryRouter;
