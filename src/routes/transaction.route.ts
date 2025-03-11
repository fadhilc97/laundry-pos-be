import { Router } from "express";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import {
  postCreateTransactionController,
  getListTransactionController,
  getDetailTransactionController,
  putUpdateTransactionController,
} from "@/controllers";

const transactionRouter = Router();

transactionRouter.use(authMiddleware, roleMiddleware(Role.OWNER, Role.STAFF));
transactionRouter.get("/", getListTransactionController);
transactionRouter.get("/:id", getDetailTransactionController);
transactionRouter.put("/:id", putUpdateTransactionController);
transactionRouter.post("/", postCreateTransactionController);

export default transactionRouter;
