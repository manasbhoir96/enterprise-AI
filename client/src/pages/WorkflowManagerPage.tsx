import React, { useState, useEffect } from "react";
import { WorkflowCanvas } from "../components/workflows/WorkflowCanvas.js";
import { AuditLogTable } from "../components/workflows/AuditLogTable.js";
import { apiRequest } from "../lib/api.js";
import { ShieldAlert, Cpu, Landmark, CheckCircle2, Activity } from "lucide-react";
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
      {/* Top Executive Fiduciary Header */}
      <div className="bg-white p-5 rounded-3xl border border-gold-300/80 shadow-luxuryCard flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500 to-amber-700 flex items-center justify-center text-white shadow-goldSoft border border-gold-300">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 font-serif-luxury tracking-wide">
                Autonomous Covenant & Fiduciary Review Engine
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-100 text-gold-900 border border-gold-300 uppercase tracking-wider font-mono">
                Tier 1 AI Audit
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Deterministic statutory verification, indemnification checks, and automated risk scoring backed by Gemini 3.8 Flash.
            </p>
          </div>
        </div>

        {/* Financial telemetry pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-gold-50 border border-gold-200 text-gold-900 font-medium flex items-center gap-1.5 shadow-2xs">
            <Activity className="w-3.5 h-3.5 text-gold-700" />
            <span>Active Protocols: <strong className="font-mono">{workflows.length}</strong></span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#FCFBF8] border border-gold-200 text-slate-700 font-medium flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Executed Sweeps: <strong className="font-mono text-gold-900">{executions.length}</strong></span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-gold-100/70 border border-gold-300 text-gold-950 font-bold flex items-center gap-1.5 shadow-2xs font-mono">
            <span>Continuous SOC2 Verification</span>
          </div>
        </div>
      </div>

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
