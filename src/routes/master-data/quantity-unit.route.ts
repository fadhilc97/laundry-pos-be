import {
  getListQuantityUnitController,
  postCreateQuantityUnitController,
  putUpdateQuantityUnitController,
  deleteQuantityUnitController,
} from "@/controllers";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import { Router } from "express";

const quantityUnitRouter = Router();

quantityUnitRouter.use(authMiddleware, roleMiddleware(Role.OWNER));
quantityUnitRouter.get("/", getListQuantityUnitController);
quantityUnitRouter.post("/", postCreateQuantityUnitController);
quantityUnitRouter.put("/:id", putUpdateQuantityUnitController);
quantityUnitRouter.delete("/:id", deleteQuantityUnitController);

export default quantityUnitRouter;
