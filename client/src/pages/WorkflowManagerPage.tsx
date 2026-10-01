import React, { useState, useEffect } from "react";
import { WorkflowCanvas } from "../components/workflows/WorkflowCanvas.js";
import { AuditLogTable } from "../components/workflows/AuditLogTable.js";
import { apiRequest } from "../lib/api.js";
import type { AIWorkflow, KnowledgeAsset, WorkflowExecution } from "@nexusai/shared";

export const WorkflowManagerPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<AIWorkflow[]>([]);
  const [assets, setAssets] = useState<KnowledgeAsset[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [wfRes, assetRes, execRes] = await Promise.all([
        apiRequest<{ workflows: AIWorkflow[] }>("/workflows"),
        apiRequest<{ assets: KnowledgeAsset[] }>("/knowledge"),
        apiRequest<{ executions: WorkflowExecution[] }>("/workflows/executions"),
      ]);
      setWorkflows(wfRes.workflows);
      setAssets(assetRes.assets);
      setExecutions(execRes.executions);
    } catch (err) {
      console.error("Failed to load workflow data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Interactive Workflow Canvas Runner */}
      <WorkflowCanvas
        workflows={workflows}
        assets={assets}
        onWorkflowCreated={loadData}
        onExecutionCompleted={loadData}
      />

      {/* Historical Audit Execution Trail */}
      <AuditLogTable executions={executions} />
    </div>
  );
};
