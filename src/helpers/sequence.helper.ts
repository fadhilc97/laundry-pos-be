import { eq, and } from "drizzle-orm";
import { UserLaundry, LaundryConfig, Sequence } from "@/schemas";
import { db } from "@/services";
import { Response } from "express";

// TODO: Refactor into a function only

export async function getCurrentLaundrySequence(res: Response, userId: number) {
  const userLaundry = await db.query.UserLaundry.findFirst({
    where: eq(UserLaundry.userId, userId),
    columns: { laundryId: true },
  });

  if (!userLaundry) {
    res.status(404).json({ message: "You're not registered in your laundry" });
    return;
  }

  const laundryConfig = await db.query.LaundryConfig.findFirst({
    where: and(
      eq(LaundryConfig.laundryId, userLaundry.laundryId),
      eq(LaundryConfig.key, "transaction_sequence_id")
    ),
    columns: { value: true },
  });

  if (!laundryConfig) {
    res.status(404).json({
      message:
        "The transaction sequence is not configured to your laundry. Please contact our system support",
    });
    return;
  }

  const sequence = await db.query.Sequence.findFirst({
    where: eq(Sequence.id, +laundryConfig.value),
    columns: {
      id: true,
      minDigits: true,
      currentSequence: true,
    },
  });

  return sequence;
}

export async function getCurrentPaymentSequence(res: Response, userId: number) {
  const userLaundry = await db.query.UserLaundry.findFirst({
    where: eq(UserLaundry.userId, userId),
    columns: { laundryId: true },
  });

  if (!userLaundry) {
    res.status(404).json({ message: "You're not registered in your laundry" });
    return;
  }

  const laundryConfig = await db.query.LaundryConfig.findFirst({
    where: and(
      eq(LaundryConfig.laundryId, userLaundry.laundryId),
      eq(LaundryConfig.key, "payment_sequence_id")
    ),
    columns: { value: true },
  });

  if (!laundryConfig) {
    res.status(404).json({
      message:
        "The payment sequence is not configured to your laundry. Please contact our system support",
    });
    return;
  }

  const sequence = await db.query.Sequence.findFirst({
    where: eq(Sequence.id, +laundryConfig.value),
    columns: {
      id: true,
      minDigits: true,
      currentSequence: true,
    },
  });

  return sequence;
}
