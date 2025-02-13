import { postCreateLaundryController } from "@/controllers";
import { authMiddleware } from "@/middlewares";
import { Router } from "express";

const laundryRouter = Router();

laundryRouter.use(authMiddleware);
laundryRouter.post("/", postCreateLaundryController);

export default laundryRouter;
