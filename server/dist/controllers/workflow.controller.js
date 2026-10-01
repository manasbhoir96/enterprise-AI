import { query } from "../db/index.js";
import { executeRiskAssessmentWorkflow } from "../services/gemini.service.js";
export async function listWorkflows(req, res) {
    const orgId = req.user.organization_id;
    try {
        const result = await query(`SELECT w.id, w.organization_id, w.created_by, w.name, w.system_prompt,
              w.target_department, w.created_at,
              u.full_name as creator_name,
              COUNT(e.id)::int as execution_count
       FROM ai_workflows w
       JOIN users u ON w.created_by = u.id
       LEFT JOIN workflow_executions e ON w.id = e.workflow_id
       WHERE w.organization_id = $1
       GROUP BY w.id, u.full_name
       ORDER BY w.created_at DESC`, [orgId]);
        res.json({ workflows: result.rows });
    }
    catch (error) {
        console.error("List workflows error:", error);
        res.status(500).json({ error: "Failed to fetch workflows" });
    }
}
export async function createWorkflow(req, res) {
    const orgId = req.user.organization_id;
    const userId = req.user.id;
    const { name, systemPrompt, targetDepartment } = req.body;
    try {
        const result = await query(`INSERT INTO ai_workflows (organization_id, created_by, name, system_prompt, target_department)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, organization_id, created_by, name, system_prompt, target_department, created_at`, [orgId, userId, name, systemPrompt, targetDepartment]);
        res.status(201).json({
            message: "AI Workflow created successfully",
            workflow: {
                ...result.rows[0],
                creator_name: req.user.full_name,
                execution_count: 0,
            },
        });
    }
    catch (error) {
        console.error("Create workflow error:", error);
        res.status(500).json({ error: "Failed to create workflow" });
    }
}
export async function executeWorkflow(req, res) {
    const orgId = req.user.organization_id;
    const userId = req.user.id;
    const { workflowId, inputData } = req.body;
    const customApiKey = req.headers["x-gemini-key"] || undefined;
    const startTime = Date.now();
    try {
        // 1. Verify workflow belongs to this organization
        const workflowRes = await query(`SELECT id, name, system_prompt, target_department 
       FROM ai_workflows 
       WHERE id = $1 AND organization_id = $2`, [workflowId, orgId]);
        if (workflowRes.rows.length === 0) {
            res.status(404).json({ error: "Workflow not found or access denied" });
            return;
        }
        const workflow = workflowRes.rows[0];
        // 2. Insert initial execution record with 'processing' status
        const executionRes = await query(`INSERT INTO workflow_executions 
       (workflow_id, executed_by, status, input_payload)
       VALUES ($1, $2, 'processing', $3)
       RETURNING id, created_at`, [workflow.id, userId, JSON.stringify({ inputData, targetDepartment: workflow.target_department })]);
        const executionId = executionRes.rows[0].id;
        // 3. Execute AI Synthesis via Gemini with OpenAPI structured JSON schema
        let aiResponse;
        let status = "completed";
        try {
            aiResponse = await executeRiskAssessmentWorkflow({
                organizationName: req.user.org_name || "Enterprise Organization",
                industry: req.user.industry || "Enterprise SaaS",
                classification: "confidential",
                documentText: inputData,
                customPrompt: workflow.system_prompt,
                customApiKey,
            });
        }
        catch (aiErr) {
            console.error("AI Workflow execution error:", aiErr);
            status = "failed";
            aiResponse = { error: "AI execution encountered an unexpected issue" };
        }
        const durationMs = Date.now() - startTime;
        // 4. Update execution record with result and runtime telemetry
        await query(`UPDATE workflow_executions 
       SET status = $1, ai_response = $2, execution_time_ms = $3 
       WHERE id = $4`, [status, JSON.stringify(aiResponse), durationMs, executionId]);
        res.json({
            executionId,
            workflowId: workflow.id,
            workflowName: workflow.name,
            status,
            executionTimeMs: durationMs,
            result: aiResponse,
        });
    }
    catch (error) {
        console.error("Execute workflow controller error:", error);
        res.status(500).json({ error: "Failed to execute AI workflow" });
    }
}
export async function listExecutions(req, res) {
    const orgId = req.user.organization_id;
    try {
        const result = await query(`SELECT e.id, e.workflow_id, e.executed_by, e.status, e.input_payload,
              e.ai_response, e.execution_time_ms, e.created_at,
              w.name as workflow_name,
              u.full_name as executor_name
       FROM workflow_executions e
       JOIN ai_workflows w ON e.workflow_id = w.id
       JOIN users u ON e.executed_by = u.id
       WHERE w.organization_id = $1
       ORDER BY e.created_at DESC
       LIMIT 50`, [orgId]);
        res.json({ executions: result.rows });
    }
    catch (error) {
        console.error("List executions error:", error);
        res.status(500).json({ error: "Failed to fetch workflow audit executions" });
    }
}
export async function getExecutionById(req, res) {
    const orgId = req.user.organization_id;
    const { id } = req.params;
    try {
        const result = await query(`SELECT e.id, e.workflow_id, e.executed_by, e.status, e.input_payload,
              e.ai_response, e.execution_time_ms, e.created_at,
              w.name as workflow_name,
              u.full_name as executor_name
       FROM workflow_executions e
       JOIN ai_workflows w ON e.workflow_id = w.id
       JOIN users u ON e.executed_by = u.id
       WHERE e.id = $1 AND w.organization_id = $2`, [id, orgId]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Execution record not found" });
            return;
        }
        res.json({ execution: result.rows[0] });
    }
    catch (error) {
        console.error("Get execution error:", error);
        res.status(500).json({ error: "Failed to fetch execution detail" });
    }
}
