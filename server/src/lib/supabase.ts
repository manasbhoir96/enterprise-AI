import { createClient, SupabaseClient } from "@supabase/supabase-js";
import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

export const supabase: SupabaseClient | null = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  provider: "Supabase Cloud" | "Local PostgreSQL";
  databaseUrlMasked: string;
  hasApiKeys: boolean;
  sslEnabled: boolean;
  status: "connected" | "ready" | "unconfigured";
}

export function getDatabaseStatus(): SupabaseConfigStatus {
  const currentDbUrl = process.env.DATABASE_URL || "postgresql://localhost:5432/nexusai_db";
  const isSupabase = currentDbUrl.includes("supabase.co") || currentDbUrl.includes("supabase.com");

  // Mask database URL for safety
  const masked = currentDbUrl.replace(/:([^:@]+)@/, ":••••••••@");

  return {
    isConfigured: isSupabase || Boolean(supabaseUrl),
    provider: isSupabase ? "Supabase Cloud" : "Local PostgreSQL",
    databaseUrlMasked: masked,
    hasApiKeys: Boolean(supabaseUrl && supabaseKey),
    sslEnabled: isSupabase,
    status: isSupabase ? "connected" : "ready",
  };
}

/**
 * Test a Supabase / PostgreSQL connection string
 */
export async function testConnection(connectionString: string): Promise<{ success: boolean; message: string; version?: string }> {
  const { Pool } = pg;
  const isRemote = connectionString.includes("supabase") || connectionString.includes(".com") || connectionString.includes(".net");

  const testPool = new Pool({
    connectionString,
    connectionTimeoutMillis: 7000,
    ssl: isRemote ? { rejectUnauthorized: false } : undefined,
  });

  try {
    const client = await testPool.connect();
    const res = await client.query("SELECT version();");
    client.release();
    await testPool.end();
    return {
      success: true,
      message: "Successfully connected to database!",
      version: res.rows[0]?.version?.split(" ")[1] || "PostgreSQL 15+",
    };
  } catch (error: any) {
    await testPool.end().catch(() => {});
    return {
      success: false,
      message: error.message || "Failed to connect to database.",
    };
  }
}

/**
 * Run schema initialization on a remote Supabase / Postgres database
 */
export async function migrateDatabase(connectionString: string): Promise<{ success: boolean; message: string }> {
  const { Pool } = pg;
  const isRemote = connectionString.includes("supabase") || connectionString.includes(".com") || connectionString.includes(".net");

  const migratePool = new Pool({
    connectionString,
    connectionTimeoutMillis: 10000,
    ssl: isRemote ? { rejectUnauthorized: false } : undefined,
  });

  try {
    const schemaPath = path.resolve(__dirname, "../db/schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");
    const client = await migratePool.connect();
    await client.query(schemaSql);
    client.release();
    await migratePool.end();
    return {
      success: true,
      message: "Supabase schema migrated successfully with all tables, enums, and indexes!",
    };
  } catch (error: any) {
    await migratePool.end().catch(() => {});
    return {
      success: false,
      message: error.message || "Migration failed.",
    };
  }
}
