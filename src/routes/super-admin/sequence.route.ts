import { Router } from "express";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { Role } from "@/utils";
import {
  getListSequenceController,
  postCreateSequenceController,
  putUpdateSequenceController,
  deleteSequenceController,
} from "@/controllers";

const sequenceRouter = Router();

sequenceRouter.use(authMiddleware, roleMiddleware(Role.SUPER_ADMIN));
sequenceRouter.get("/", getListSequenceController);
sequenceRouter.post("/", postCreateSequenceController);
sequenceRouter.put("/:id", putUpdateSequenceController);
sequenceRouter.delete("/:id", deleteSequenceController);

export default sequenceRouter;
