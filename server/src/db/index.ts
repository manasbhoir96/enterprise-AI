import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/nexusai_db";
const isRemoteOrSupabase = connectionString.includes("supabase") || connectionString.includes(".com") || connectionString.includes(".net");

export const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 7000,
  ssl: isRemoteOrSupabase ? { rejectUnauthorized: false } : undefined,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
});

export async function initDatabase(): Promise<void> {
  let client;
  try {
    client = await pool.connect();
    let schemaSql = "";
    const possiblePaths = [
      path.join(__dirname, "schema.sql"),
      path.join(__dirname, "../src/db/schema.sql"),
      path.join(process.cwd(), "server/src/db/schema.sql"),
      path.join(process.cwd(), "src/db/schema.sql"),
    ];
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        schemaSql = fs.readFileSync(p, "utf-8");
        break;
      }
    }
    if (schemaSql) {
      await client.query(schemaSql);
      console.log("✅ PostgreSQL schema initialized successfully");
    } else {
      console.log("ℹ️ Schema file located or skipped.");
    }
  } catch (error) {
    console.warn("Notice: Database connection or schema init note:", error);
  } finally {
    if (client) client.release();
  }
}

/**
 * Execute query with automatic client management
 */
export async function query<T extends pg.QueryResultRow = any>(text: string, params?: any[]): Promise<pg.QueryResult<T>> {
  return pool.query<T>(text, params);
}

/**
 * Execute queries in a transaction
 */
export async function transaction<T>(callback: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
