import { Router } from "express";
import authRouter from "./auth.route";
import { authMiddleware } from "@/middlewares";
import laundryRouter from "./laundry.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/laundry", laundryRouter);

router.use(authMiddleware);

export default router;
