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
      <div className="glass-panel p-6 rounded-3xl border border-[#00E5FF]/25 shadow-[0_0_35px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute inset-0 hologram-laser-sweep pointer-events-none" />

        <div className="flex items-center space-x-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00FFA3] via-[#00E5FF] to-[#7000FF] p-[1.5px] shadow-[0_0_15px_rgba(0,229,255,0.4)] shrink-0">
            <div className="w-full h-full bg-[#050811] rounded-[14px] flex items-center justify-center">
              <Cpu className="w-6 h-6 text-[#00FFA3] animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-quant text-white tracking-wide">
                Autonomous Covenant & Fiduciary Review Engine
              </h2>
              <span className="text-[10px] font-bold font-quant px-2.5 py-0.5 rounded-full bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/30 uppercase tracking-wider">
                AGENTIC DAG
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Deterministic statutory verification, indemnification audits, and automated risk scoring backed by Gemini 2.5 Flash.
            </p>
          </div>
        </div>

        {/* Financial telemetry pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs relative z-10">
          <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-slate-300 font-medium flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="font-quant">Protocols: <strong className="text-white">{workflows.length}</strong></span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-slate-300 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00FFA3]" />
            <span className="font-quant">Audited Sweeps: <strong className="text-[#00FFA3]">{executions.length}</strong></span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#7000FF]/20 border border-[#7000FF]/40 text-[#C084FC] font-bold flex items-center gap-1.5 font-quant text-[11px]">
            <span>SOC-2 COMPLIANT PERIMETER</span>
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
