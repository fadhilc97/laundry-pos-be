import { Router } from "express";
import authRouter from "./auth.route";
import { authMiddleware } from "@/middlewares";
import laundryRouter from "./laundry.route";
import { currencyRouter, locationRouter } from "./master-data";

const router = Router();

router.use("/auth", authRouter);
router.use("/laundry", laundryRouter);
router.use("/currency", currencyRouter);
router.use("/location", locationRouter);

router.use(authMiddleware);

export default router;
