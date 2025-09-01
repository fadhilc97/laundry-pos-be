import {
  postCreateLaundryController,
  getMyLaundryController,
  postCreateLaundryConfigController,
  putUpdateLaundryConfigController,
  putUpdateMyLaundryController,
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
laundryRouter.get(
  "/me",
  roleMiddleware(Role.OWNER, Role.STAFF),
  getMyLaundryController
);
laundryRouter.put(
  "/me",
  roleMiddleware(Role.OWNER),
  putUpdateMyLaundryController
);
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
