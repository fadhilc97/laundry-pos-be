import { Router } from "express";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import { getListRoleController } from "@/controllers";

const roleRouter = Router();

roleRouter.use(authMiddleware, roleMiddleware(Role.SUPER_ADMIN, Role.OWNER));
roleRouter.get("/", getListRoleController);

export default roleRouter;
