import { Router } from "express";
import authRouter from "./auth.route";
import { authMiddleware } from "@/middlewares";

const router = Router();

router.use("/auth", authRouter);

router.use(authMiddleware);

export default router;
