import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import {
  getListProductController,
  postCreateProductController,
  putUpdateProductController,
} from "@/controllers";
import { Router } from "express";

const productRouter = Router();

productRouter.use(authMiddleware, roleMiddleware(Role.OWNER));
productRouter.get("/", getListProductController);
productRouter.post("/", postCreateProductController);
productRouter.put("/:id", putUpdateProductController);
// productRouter.delete("/:id");

export default productRouter;
