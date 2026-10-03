import app from "../server/src/app.js";
import { initDatabase } from "../server/src/db/index.js";

let dbInitialized = false;

export default async function handler(req: any, res: any) {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
    } catch (e: any) {
      console.warn("Vercel DB initialization note:", e?.message || e);
    }
  }

  // Forward request to Express application
  return app(req, res);
}
