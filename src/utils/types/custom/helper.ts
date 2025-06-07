import { Response } from "express";

export type HelperOptions = {
  configKey: string;
  userId: number;
  res: Response;
};
