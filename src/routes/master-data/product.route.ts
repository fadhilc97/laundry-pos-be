import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import {
  getListProductController,
  postCreateProductController,
  putUpdateProductController,
  deleteProductController,
  getDetailsProductController,
} from "@/controllers";
import { Router } from "express";

const productRouter = Router();

productRouter.use(authMiddleware);

productRouter.use(roleMiddleware(Role.OWNER, Role.STAFF));
productRouter.get("/", getListProductController);
productRouter.get("/:id", getDetailsProductController);

productRouter.use(roleMiddleware(Role.OWNER));
productRouter.post("/", postCreateProductController);
productRouter.put("/:id", putUpdateProductController);
productRouter.delete("/:id", deleteProductController);

export default productRouter;
