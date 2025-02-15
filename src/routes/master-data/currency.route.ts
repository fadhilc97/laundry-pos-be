import {
  postCreateCurrencyController,
  getListCurrencyController,
} from "@/controllers";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import { Router } from "express";

const currencyRouter = Router();

currencyRouter.use(authMiddleware, roleMiddleware(Role.OWNER));
currencyRouter.get("/", getListCurrencyController);
currencyRouter.post("/", postCreateCurrencyController);

export default currencyRouter;
