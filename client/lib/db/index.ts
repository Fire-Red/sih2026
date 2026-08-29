import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "[DB] Warning: DATABASE_URL environment variable is not defined. Database operations will fail at runtime."
  );
}

const sql = neon(connectionString || "postgresql://placeholder:placeholder@localhost:5432/placeholder");

export const db = drizzle(sql, { schema });
