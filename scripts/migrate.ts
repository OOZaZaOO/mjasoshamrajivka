import { readFile } from "node:fs/promises";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to run migrations");

const sql = neon(databaseUrl);
const migrationsDir = join(process.cwd(), "db/migrations");
const files = (await readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();

for (const file of files) {
  const migration = await readFile(join(migrationsDir, file), "utf8");
  const statements = migration
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log(`Applied ${file}`);
}
