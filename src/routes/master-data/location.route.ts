import {
  getListLocationController,
  postCreateLocationController,
  putUpdateLocationController,
  deleteLocationController,
} from "@/controllers";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import { Router } from "express";

const locationRouter = Router();

locationRouter.use(authMiddleware);

locationRouter.use(roleMiddleware(Role.OWNER, Role.STAFF));
locationRouter.get("/", getListLocationController);

locationRouter.use(roleMiddleware(Role.OWNER));
locationRouter.post("/", postCreateLocationController);
locationRouter.put("/:id", putUpdateLocationController);
locationRouter.delete("/:id", deleteLocationController);

export default locationRouter;
