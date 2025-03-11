import { Request, Response } from "express";
import { db } from "@/services";
import { Transaction } from "@/schemas";
import { eq } from "drizzle-orm";

type TransactionAction = "IN_PROCESS" | "FINISHED" | "CHECK_OUT";
const TRANSACTION_STATUS_FLOW = [
  "CHECK_IN",
  "IN_PROCESS",
  "FINISHED",
  "CHECK_OUT",
];

export async function putUpdateTransactionController(
  req: Request,
  res: Response
) {
  const { id } = req.params as { id: string };
  const { action } = req.query as { action: TransactionAction };

  const transaction = await db.query.Transaction.findFirst({
    where: eq(Transaction.id, +id),
    columns: {
      id: true,
      status: true,
      paymentStatus: true,
    },
  });

  if (!transaction) {
    res.status(404).json({ message: "Transaction not found" });
    return;
  }

  const transactionStatusIndex = TRANSACTION_STATUS_FLOW.indexOf(
    transaction.status
  );
  const actionStatusIndex = TRANSACTION_STATUS_FLOW.indexOf(action);

  if (transactionStatusIndex !== actionStatusIndex - 1) {
    res.status(422).json({
      message: `Unable to proceed this transaction. The status ${
        TRANSACTION_STATUS_FLOW[actionStatusIndex - 1]
      } is required`,
    });
    return;
  }

  switch (action) {
    case "IN_PROCESS":
      await proceedTransaction(res, transaction.id);
      break;
    case "FINISHED":
      await finishProceedTransaction(res, transaction.id);
      break;
    case "CHECK_OUT":
      if (transaction.paymentStatus === "UNPAID") {
        res
          .status(422)
          .json({ message: "Unable to check-out on unpaid transaction" });
        return;
      }
      await checkOutTransaction(res, transaction.id);
      break;
    default:
      res.status(404).json({
        message: "Action not found or not defined for this transaction",
      });
  }
}

async function proceedTransaction(res: Response, id: number) {
  await db
    .update(Transaction)
    .set({ status: "IN_PROCESS" })
    .where(eq(Transaction.id, id));
  res.status(200).json({ message: "Success proceed transaction" });
}

async function finishProceedTransaction(res: Response, id: number) {
  await db
    .update(Transaction)
    .set({ status: "FINISHED", finishedDate: new Date() })
    .where(eq(Transaction.id, id));
  res.status(200).json({ message: "Success finished transaction" });
}

async function checkOutTransaction(res: Response, id: number) {
  await db
    .update(Transaction)
    .set({ status: "CHECK_OUT", checkOutDate: new Date() })
    .where(eq(Transaction.id, id));
  res.status(200).json({ message: "Success check-out transaction" });
}
