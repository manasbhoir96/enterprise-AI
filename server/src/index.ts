import app from "./app.js";
import { initDatabase } from "./db/index.js";
import { autoSeedIfEmpty } from "./db/seed.js";

const PORT = process.env.PORT || 5005;

// Start Server & Database for local runtime
async function bootstrap() {
  try {
    console.log("⚡ Bootstrapping NexusAI Enterprise Backend...");
    await initDatabase();
    await autoSeedIfEmpty();

    app.listen(PORT, () => {
      console.log(`🚀 NexusAI Enterprise Server active on http://localhost:${PORT}`);
      console.log(`🛡️  Multi-Tenant Isolation & RLS Security Active`);
    });
  } catch (error) {
    console.error("💥 Failed to start NexusAI server:", error);
    process.exit(1);
  }
}

bootstrap();

export default app;
