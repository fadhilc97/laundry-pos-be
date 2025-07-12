import { getDashboardDataController } from "@/controllers";
import { authMiddleware } from "@/middlewares";
import { Router } from "express";

const dashboardRouter = Router();

dashboardRouter.use(authMiddleware);
dashboardRouter.get("/", getDashboardDataController);

export default dashboardRouter;
