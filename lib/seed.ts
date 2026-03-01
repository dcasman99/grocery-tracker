import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = process.env.TURSO_DATABASE_URL
  ? createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  : createClient({
      url: "file:grocery.db",
    });

console.log(
  "Using database:",
  process.env.TURSO_DATABASE_URL || "file:grocery.db",
);

const db = drizzle(client, { schema });

// Seed roommates
const roommates = [
  { id: "1", name: "Dean" },
  { id: "2", name: "Zach" },
  { id: "3", name: "Chris" },
];

async function seed() {
  for (const roommate of roommates) {
    await db.insert(schema.roommates).values(roommate).onConflictDoNothing();
  }
  console.log("Database seeded successfully!");
}

seed().catch(console.error);
