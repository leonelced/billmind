import { defineConfig } from "drizzle-kit";

const dbUrl = process.env.DB_URL;
if (!dbUrl) throw new Error("Missing DB_URL in .env") 

export default defineConfig({
  schema: "./src/db/schema.ts", // path to schema (where table definitions are)
  out: "./src/db/migrations", // path to generated files
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl, // the connection string
  },
});