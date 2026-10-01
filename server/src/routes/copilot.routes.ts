import { Router } from "express";
import { queryCopilot } from "../controllers/copilot.controller.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { CopilotQuerySchema } from "@nexusai/shared";

const router = Router();

router.use(authenticateToken);

router.post("/query", validateBody(CopilotQuerySchema), queryCopilot);

export default router;
