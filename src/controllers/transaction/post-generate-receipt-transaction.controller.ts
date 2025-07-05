import { Transaction, TransactionItem, UserLaundry } from "@/schemas";
import { db, getHtmlToPdf } from "@/services";
import { IAuthRequest, IReceiptTemplateData } from "@/utils";
import { eq, sql } from "drizzle-orm";
import { Response } from "express";
import _ from "lodash";
import moment from "moment";
import path from "path";

type Params = {
  id: string;
};

export async function postGenerateReceiptTransactionController(
  req: IAuthRequest,
  res: Response
) {
  const { id } = req.params as Params;
  await generateReceiptTransaction(+id, req.userId as number);
  res.status(200).json({ message: "Success generate receipt" });
}

export async function generateReceiptTransaction(
  transactionId: number,
  userId: number
) {
  const transaction = await db.query.Transaction.findFirst({
    where: eq(Transaction.id, transactionId),
    columns: {
      transactionNo: true,
    },
  });

  const fileStorePath = process.env.FILESTORE_PATH as string;
  const pdfPath = path.join(
    fileStorePath,
    "receipts",
    `Receipt-${transaction?.transactionNo}.pdf`
  );
  const receiptData = await getReceiptData(userId, transactionId);
  await getHtmlToPdf<IReceiptTemplateData>("receipt", pdfPath, receiptData, {
    width: "10cm",
    preferCSSPageSize: true,
  });
}

async function getReceiptData(
  userId: number,
  transactionId: number
): Promise<IReceiptTemplateData> {
  const laundry = await getLaundryData(userId);
  const transactionInfo = await getTransactionInfo(transactionId);
  const items = await getTransactionItems(transactionId);
  const summary = await getTransactionSummary(transactionId);

  return {
    laundry,
    transactionInfo,
    items,
    summary,
  };
}

async function getLaundryData(userId: number) {
  return db.query.UserLaundry.findFirst({
    where: eq(UserLaundry.userId, userId),
    with: {
      laundry: {
        columns: { name: true, address: true },
        with: {
          laundryContacts: {
            with: {
              contact: {
                columns: { name: true, details: true },
              },
            },
            columns: {},
          },
        },
      },
    },
    columns: {},
  }).then((result) => ({
    name: result?.laundry.name || "",
    address: result?.laundry.address || "",
    contactsDisplay:
      result?.laundry.laundryContacts
        .map((contact) => {
          const currContactName = _.capitalize(contact.contact.name);
          return `${currContactName} : ${contact.contact.details}`;
        })
        .join(" | ") || "",
  }));
}

async function getTransactionInfo(transactionId: number) {
  return await db.query.Transaction.findFirst({
    where: eq(Transaction.id, transactionId),
    columns: {
      transactionNo: true,
      checkInDate: true,
      serviceType: true,
    },
    with: {
      customer: {
        columns: { name: true },
        with: {
          customerContacts: {
            with: {
              contact: {
                columns: { details: true },
              },
            },
          },
        },
      },
    },
  }).then((result) => ({
    reference: result?.transactionNo || "",
    date: moment(result?.checkInDate || new Date()).format(
      "DD-MM-YYYY HH:mm:ss"
    ),
    serviceType: _.capitalize(result?.serviceType || "REGULAR"),
    customerName: result?.customer.name || "",
    customerContact: result?.customer.customerContacts[0].contact.details || "",
  }));
}

async function getTransactionItems(transactionId: number) {
  return await db.query.TransactionItem.findMany({
    where: eq(TransactionItem.transactionId, transactionId),
    with: {
      quantityUnit: {
        columns: { shortName: true },
      },
    },
    columns: {
      description: true,
      qty: true,
      price: true,
    },
    extras: {
      subTotal:
        sql<number>`${TransactionItem.qty} * ${TransactionItem.price}`.as(
          "subTotal"
        ),
    },
  }).then((results) =>
    results.map((item) => ({
      description: item.description,
      qty: item.qty,
      qtyUnit: item.quantityUnit.shortName,
      price: (+item.price).toLocaleString("en-US"),
      subTotal: (+item.subTotal).toLocaleString("en-US"),
    }))
  );
}

async function getTransactionSummary(transactionId: number) {
  return await db.query.Transaction.findFirst({
    where: eq(Transaction.id, transactionId),
    extras: {
      totalTransactionAmount: sql<number>`(
            SELECT COALESCE(SUM("qty" * "price"), 0)::INT
            FROM "TransactionItem"
            WHERE "transactionId" = ${transactionId}
          )`.as("totalTransactionAmount"),
      totalPaidAmount: sql<number>`(
            SELECT COALESCE(SUM("amount"), 0)::INT
            FROM "TransactionPayment"
            WHERE "transactionId" = ${transactionId} AND "status" = 'DONE'
          )`.as("totalPaidAmount"),
    },
    columns: {},
  }).then((result) => ({
    total: (result?.totalTransactionAmount || 0).toLocaleString("en-US"),
    paid: (result?.totalPaidAmount || 0).toLocaleString("en-US"),
    pending: (
      (result?.totalTransactionAmount || 0) - (result?.totalPaidAmount || 0)
    ).toLocaleString("en-US"),
  }));
}
