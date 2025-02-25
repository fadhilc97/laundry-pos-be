import { Router } from "express";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import {
  postCreateTransactionController,
  getListTransactionController,
} from "@/controllers";

const transactionRouter = Router();

transactionRouter.use(authMiddleware, roleMiddleware(Role.OWNER, Role.STAFF));
transactionRouter.get("/", getListTransactionController);
transactionRouter.post("/", postCreateTransactionController);

export default transactionRouter;
