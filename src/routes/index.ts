import { Router } from "express";
import authRouter from "./auth.route";
import laundryRouter from "./laundry.route";
import transactionRouter from "./transaction.route";
import {
  currencyRouter,
  locationRouter,
  quantityUnitRouter,
  productRouter,
  customerRouter,
} from "./master-data";
import { sequenceRouter } from "./super-admin";
import profileRouter from "./profile.route";
import dashboardRouter from "./dashboard.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/dashboard", dashboardRouter);
router.use("/laundry", laundryRouter);
router.use("/currency", currencyRouter);
router.use("/location", locationRouter);
router.use("/quantity-unit", quantityUnitRouter);
router.use("/product", productRouter);
router.use("/customer", customerRouter);
router.use("/transaction", transactionRouter);
router.use("/sequence", sequenceRouter);
router.use("/profile", profileRouter);

export default router;
