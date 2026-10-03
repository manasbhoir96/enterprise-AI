import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import knowledgeRoutes from "./routes/knowledge.routes.js";
import copilotRoutes from "./routes/copilot.routes.js";
import workflowRoutes from "./routes/workflow.routes.js";
import orgRoutes from "./routes/org.routes.js";

dotenv.config();

export const app = express();

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    hidePoweredBy: false,
  })
);
app.disable("x-powered-by");

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Rate limiter for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes" },
});

app.use("/api/", apiLimiter);

// Body parser
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Routes - mounted both with /api and without /api for universal serverless/proxy compatibility
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/knowledge", knowledgeRoutes);
app.use("/knowledge", knowledgeRoutes);

app.use("/api/copilot", copilotRoutes);
app.use("/copilot", copilotRoutes);

app.use("/api/workflows", workflowRoutes);
app.use("/workflows", workflowRoutes);

app.use("/api/org", orgRoutes);
app.use("/org", orgRoutes);

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
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled server exception:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error occurred",
  });
});

export default app;
