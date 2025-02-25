import { Transaction } from "@/schemas";
import { db } from "@/services";
import { IAuthRequest, Role } from "@/utils";
import { eq } from "drizzle-orm";
import { Response } from "express";

export async function getListTransactionController(
  req: IAuthRequest,
  res: Response
) {
  const transactions = await db.query.Transaction.findMany({
    with: {
      customer: {
        columns: { name: true },
        with: {
          customerContacts: {
            columns: {},
            with: {
              contact: {
                columns: { name: true, details: true },
              },
            },
          },
        },
      },
    },
    columns: {
      id: true,
      transactionNo: true,
      checkInDate: true,
      checkOutDate: true,
      status: true,
      paymentStatus: true,
    },
    where: !req.userRoles?.includes(Role.OWNER)
      ? eq(Transaction.userId, req.userId as number)
      : undefined,
  });

  res
    .status(200)
    .json({ message: "Success get transaction list", data: transactions });
}
