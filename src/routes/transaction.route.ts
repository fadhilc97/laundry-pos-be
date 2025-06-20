import { Router } from "express";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import {
  postCreateTransactionController,
  getListTransactionController,
  getDetailTransactionController,
  putUpdateTransactionController,
  postCreateTransactionPaymentController,
  postGenerateReceiptTransactionController,
} from "@/controllers";

const transactionRouter = Router();

transactionRouter.use(authMiddleware, roleMiddleware(Role.OWNER, Role.STAFF));
transactionRouter.get("/", getListTransactionController);
transactionRouter.get("/:id", getDetailTransactionController);
transactionRouter.put("/:id", putUpdateTransactionController);
transactionRouter.post("/", postCreateTransactionController);
transactionRouter.post("/:id/payment", postCreateTransactionPaymentController);
transactionRouter.post(
  "/:id/receipt",
  postGenerateReceiptTransactionController
);

export default transactionRouter;
