import { Router } from "express";
import {
  listWorkflows,
  createWorkflow,
  executeWorkflow,
  listExecutions,
  getExecutionById,
} from "../controllers/workflow.controller.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { ExecuteWorkflowSchema, CreateWorkflowSchema } from "@nexusai/shared";

const router = Router();

router.use(authenticateToken);

router.get("/", listWorkflows);
router.post("/", validateBody(CreateWorkflowSchema), createWorkflow);
router.post("/execute", validateBody(ExecuteWorkflowSchema), executeWorkflow);
router.get("/executions", listExecutions);
router.get("/executions/:id", getExecutionById);

export default router;
