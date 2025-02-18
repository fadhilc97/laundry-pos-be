import {
  getListLocationController,
  postCreateLocationController,
  putUpdateLocationController,
} from "@/controllers";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import { Router } from "express";

const locationRouter = Router();

locationRouter.use(authMiddleware, roleMiddleware(Role.OWNER));
locationRouter.get("/", getListLocationController);
locationRouter.post("/", postCreateLocationController);
locationRouter.put("/:id", putUpdateLocationController);
// locationRouter.delete("/:id", deleteCurrencyController);

export default locationRouter;
