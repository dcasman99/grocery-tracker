import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env" });

export default defineConfig({
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || "file:grocery.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
    // url: "libsql://grocery-tracker-dcasman99.aws-us-east-1.turso.io",
    // authToken:
    //   "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzIzODQ2NDcsImlkIjoiMDE5YzlmYzUtMmYwMS03ZTg5LWI2MzItZmM1MmFhYjExNTVjIiwicmlkIjoiMmE3ZDNlNmUtZDhlNC00YjBmLTkwYTItNDRmZTVmNzRjZGIwIn0.ejFPCXzkglPmS8RTifA03zFMeuvCBAF7beG3QEwRERvjZmmessgnnwhiyt7B6NRTqUoOKBqqUlt2dhrVfpbmBA",
  } as any,
});
