import bcrypt from "bcrypt";
import { User } from "@/schemas";
import { db } from "@/services";
import {
  generateAccessToken,
  generateRefreshToken,
  IPostAuthLoginDto,
  IUserJwtPayload,
  Role,
} from "@/utils";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

export async function postAuthLoginController(req: Request, res: Response) {
  const { email, password }: IPostAuthLoginDto = req.body;

  const user = await db.query.User.findFirst({
    where: eq(User.email, email),
    with: {
      userRoles: {
        columns: {},
        with: {
          role: {
            columns: { identifier: true },
          },
        },
      },
    },
    columns: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    res.status(401).json({ message: "Invalid login!" });
    return;
  }

  const isPasswordVerified = await bcrypt.compare(password, user?.password);
  if (!isPasswordVerified) {
    res.status(401).json({ message: "Invalid login!" });
    return;
  }

  const jwtPayload: IUserJwtPayload = {
    id: user.id,
    roles: user.userRoles.map((userRole) => userRole.role.identifier) as Role[],
  };
  const accessToken = generateAccessToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1 * 60 * 1000,
  });
  res.status(201).json({ accessToken });
}
