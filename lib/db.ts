import { neon } from "@neondatabase/serverless";

let sql: ReturnType<typeof neon> | undefined;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  sql ??= neon(process.env.DATABASE_URL);
  return sql;
}
