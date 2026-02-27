import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const roommates = sqliteTable("roommates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const groceryItems = sqliteTable("grocery_items", {
  id: text("id").primaryKey(),
  item: text("item").notNull(),
  addedBy: text("added_by")
    .notNull()
    .references(() => roommates.id),
  addedByName: text("added_by_name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const purchases = sqliteTable("purchases", {
  id: text("id").primaryKey(),
  roommateId: text("roommate_id")
    .notNull()
    .references(() => roommates.id),
  roommateName: text("roommate_name").notNull(),
  amount: real("amount").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  notes: text("notes"),
});
