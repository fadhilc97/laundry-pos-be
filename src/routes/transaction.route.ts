import { Router } from "express";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import { postCreateTransactionController } from "@/controllers";

const transactionRouter = Router();

transactionRouter.use(authMiddleware, roleMiddleware(Role.OWNER, Role.STAFF));
transactionRouter.post("/", postCreateTransactionController);

export default transactionRouter;
