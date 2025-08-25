import {
  postCreateUserController,
  getUserlistController,
  putUpdateUserController,
  getUserDetailController,
} from "@/controllers";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import { Router } from "express";

const userRouter = Router();

userRouter.use(authMiddleware, roleMiddleware(Role.SUPER_ADMIN, Role.OWNER));
userRouter.get("/", getUserlistController);
userRouter.get("/:userId", getUserDetailController);
userRouter.post("/", postCreateUserController);
userRouter.put("/:userId", putUpdateUserController);

export default userRouter;
