import { postCreateUserController } from "@/controllers";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import { Router } from "express";

const userRouter = Router();

userRouter.use(authMiddleware, roleMiddleware(Role.SUPER_ADMIN, Role.OWNER));
userRouter.post("/", postCreateUserController);

export default userRouter;
