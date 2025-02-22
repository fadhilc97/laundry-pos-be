import { Router } from "express";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import {
  getListCustomerController,
  getDetailCustomerController,
  postCreateCustomerController,
  putUpdateCustomerController,
  deleteCustomerController,
  putUpdateCustomerContactController,
} from "@/controllers";

const customerRouter = Router();

customerRouter.use(authMiddleware, roleMiddleware(Role.OWNER, Role.STAFF));
customerRouter.get("/", getListCustomerController);
customerRouter.get("/:id", getDetailCustomerController);
customerRouter.post("/", postCreateCustomerController);
customerRouter.put("/:id", putUpdateCustomerController);
customerRouter.put(
  "/:id/contact/:contactId",
  putUpdateCustomerContactController
);
customerRouter.delete("/:id", deleteCustomerController);

export default customerRouter;
