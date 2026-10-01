import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { initDatabase } from "./db/index.js";
import authRoutes from "./routes/auth.routes.js";
import knowledgeRoutes from "./routes/knowledge.routes.js";
import copilotRoutes from "./routes/copilot.routes.js";
import workflowRoutes from "./routes/workflow.routes.js";
import orgRoutes from "./routes/org.routes.js";
import { autoSeedIfEmpty } from "./db/seed.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Security Middlewares
app.use(helmet({
    contentSecurityPolicy: false, // Allow flexible assets during local development
    crossOriginEmbedderPolicy: false,
}));
app.use(cors({
    origin: true,
    credentials: true,
}));
// Rate limiter for API routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // generous limit for enterprise dashboards
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests from this IP, please try again after 15 minutes" },
});
app.use("/api/", apiLimiter);
// Body parser
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/copilot", copilotRoutes);
app.use("/api/workflows", workflowRoutes);
app.use("/api/org", orgRoutes);
// Health check endpoint
app.get("/api/health", (_req, res) => {
    res.json({
        status: "healthy",
        platform: "NexusAI Enterprise Knowledge & Workflow Platform",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
    });
});
// Global error handler
app.use((err, _req, res, _next) => {
    console.error("Unhandled server exception:", err);
    res.status(err.status || 500).json({
        error: err.message || "Internal server error occurred",
    });
});
// Start Server & Database
async function bootstrap() {
    try {
        console.log("⚡ Bootstrapping NexusAI Enterprise Backend...");
        await initDatabase();
        await autoSeedIfEmpty();
        app.listen(PORT, () => {
            console.log(`🚀 NexusAI Enterprise Server active on http://localhost:${PORT}`);
            console.log(`🛡️  Multi-Tenant Isolation & RLS Security Active`);
        });
    }
    catch (error) {
        console.error("💥 Failed to start NexusAI server:", error);
        process.exit(1);
    }
}
bootstrap();
