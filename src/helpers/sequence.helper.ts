import { eq, and, ExtractTablesWithRelations } from "drizzle-orm";
import { UserLaundry, LaundryConfig, Sequence } from "@/schemas";
import { db } from "@/services";
import { Response } from "express";
import { PgTransaction } from "drizzle-orm/pg-core";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";

type GetCurrentSequenceOptions = {
  configKey: string;
  userId: number;
  res: Response;
};

type UpdateNextSequenceOptions = {
  tx: PgTransaction<
    NodePgQueryResultHKT,
    typeof import("@/schemas/index"),
    ExtractTablesWithRelations<typeof import("@/schemas/index")>
  >;
  nextSequence?: number;
  sequenceId?: number;
};

export async function getCurrentSequence(options: GetCurrentSequenceOptions) {
  const { configKey, userId, res } = options;

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
      eq(LaundryConfig.key, configKey)
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

  if (!sequence) {
    res.status(404).json({ message: "Sequence not found" });
    return;
  }

  const sequenceStringified = sequence?.currentSequence.toString();
  const nextSequence = sequence.currentSequence + 1;
  const zerosLength = !sequence.minDigits
    ? 0
    : sequence.minDigits - sequenceStringified.length;
  const sequenceNo = `${new Array(zerosLength)
    .fill("0")
    .join("")}${sequenceStringified}`;

  return { sequenceId: sequence.id, sequenceNo, nextSequence };
}

export async function updateNextSequence(options: UpdateNextSequenceOptions) {
  const { tx, nextSequence, sequenceId } = options;

  await tx
    .update(Sequence)
    .set({ currentSequence: nextSequence })
    .where(eq(Sequence.id, sequenceId as number));
}
