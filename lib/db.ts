import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { eq } from "drizzle-orm";
import { GroceryItem, Purchase, Roommate } from "@/types";

// Use Turso in production, local SQLite in development
const client = process.env.TURSO_DATABASE_URL
  ? createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  : createClient({
      url: "file:grocery.db",
    });

export const db = drizzle(client, { schema });

// Helper functions
export const getRoommates = async (): Promise<Roommate[]> => {
  return await db.select().from(schema.roommates);
};

export const getGroceryItems = async (): Promise<GroceryItem[]> => {
  return await db.select().from(schema.groceryItems);
};

export const addGroceryItem = async (
  item: Omit<GroceryItem, "id" | "createdAt">,
) => {
  const newItem = {
    id: Date.now().toString(),
    ...item,
    createdAt: new Date(),
  };
  await db.insert(schema.groceryItems).values(newItem);
  return newItem;
};

export const removeGroceryItem = async (id: string) => {
  await db.delete(schema.groceryItems).where(eq(schema.groceryItems.id, id));
};

export const getPurchases = async (): Promise<Purchase[]> => {
  return await db.select().from(schema.purchases);
};

export const addPurchase = async (purchase: Omit<Purchase, "id">) => {
  const newPurchase = {
    id: Date.now().toString(),
    ...purchase,
  };
  await db.insert(schema.purchases).values(newPurchase);
  return newPurchase;
};
