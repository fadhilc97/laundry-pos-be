import {
  postCreateLaundryController,
  getMyLaundryController,
} from "@/controllers";
import { authMiddleware } from "@/middlewares";
import { Router } from "express";

const laundryRouter = Router();

laundryRouter.use(authMiddleware);
laundryRouter.post("/", postCreateLaundryController);
laundryRouter.get("/me", getMyLaundryController);

export default laundryRouter;
