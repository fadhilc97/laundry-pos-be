import {
  postCreateCurrencyController,
  getListCurrencyController,
  putUpdateCurrencyController,
  deleteCurrencyController,
} from "@/controllers";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import { Router } from "express";

const currencyRouter = Router();

currencyRouter.use(authMiddleware, roleMiddleware(Role.OWNER));
currencyRouter.get("/", getListCurrencyController);
currencyRouter.post("/", postCreateCurrencyController);
currencyRouter.put("/:id", putUpdateCurrencyController);
currencyRouter.delete("/:id", deleteCurrencyController);

export default currencyRouter;
