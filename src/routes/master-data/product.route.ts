import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import { getListProductController } from "@/controllers";
import { Router } from "express";

const productRouter = Router();

productRouter.use(authMiddleware, roleMiddleware(Role.OWNER));
productRouter.get("/", getListProductController);

export default productRouter;
