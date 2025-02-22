import { Router } from "express";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import {
  getListCustomerController,
  postCreateCustomerController,
  putUpdateCustomerController,
  deleteCustomerController,
} from "@/controllers";

const customerRouter = Router();

customerRouter.use(authMiddleware, roleMiddleware(Role.OWNER, Role.STAFF));
customerRouter.get("/", getListCustomerController);
customerRouter.post("/", postCreateCustomerController);
customerRouter.put("/:id", putUpdateCustomerController);
customerRouter.delete("/:id", deleteCustomerController);

export default customerRouter;
