import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { User } from "../user";
import { relations } from "drizzle-orm";

export const Sequence = pgTable("Sequence", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  minDigits: integer(),
  currentSequence: integer().notNull().default(1),
  userId: integer().references(() => User.id),
});

export const sequenceRelation = relations(Sequence, ({ one }) => ({
  user: one(User, { fields: [Sequence.userId], references: [User.id] }),
}));
