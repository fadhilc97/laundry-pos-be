import {
  postCreateLaundryController,
  getMyLaundryController,
} from "@/controllers";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import { Router } from "express";

const laundryRouter = Router();

laundryRouter.use(authMiddleware, roleMiddleware(Role.OWNER));
laundryRouter.post("/", postCreateLaundryController);
laundryRouter.get("/me", getMyLaundryController);

export default laundryRouter;
