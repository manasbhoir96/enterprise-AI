import React, { useState } from "react";
import {
  Play,
  Cpu,
  Plus,
  AlertTriangle,
  CheckCircle,
  FileCode2,
  Copy,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Database,
} from "lucide-react";
import { apiRequest } from "../../lib/api.js";
import type { AIWorkflow, KnowledgeAsset, RiskReportResponse, WorkflowExecution } from "@nexusai/shared";

interface WorkflowCanvasProps {
  workflows: AIWorkflow[];
  assets: KnowledgeAsset[];
  onExecutionCompleted: () => void;
  onWorkflowCreated: () => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  workflows,
  assets,
  onExecutionCompleted,
  onWorkflowCreated,
}) => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(workflows[0]?.id || "");
  const [inputSource, setInputSource] = useState<"asset" | "custom">("asset");
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || "");
  const [customInputData, setCustomInputData] = useState<string>("");

  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    executionId: string;
    durationMs: number;
    status: string;
    report: RiskReportResponse;
  } | null>(null);

  // New Workflow Modal/Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWfName, setNewWfName] = useState("");
  const [newWfDept, setNewWfDept] = useState("Legal & Compliance");
  const [newWfPrompt, setNewWfPrompt] = useState(
    "Execute rigorous compliance analysis, identifying regulatory deviations, indemnification risks, and SLA obligations."
  );
  const [isCreatingWf, setIsCreatingWf] = useState(false);

  // Active view tab for report: "visual" | "json"
  const [reportTab, setReportTab] = useState<"visual" | "json">("visual");
  const [copied, setCopied] = useState(false);

  const selectedWorkflow = workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];

  const handleExecute = async () => {
    let payloadText = "";
    if (inputSource === "asset") {
      const asset = assets.find((a) => a.id === selectedAssetId);
      if (!asset) {
        alert("Please select a knowledge asset or provide custom text.");
        return;
      }
      payloadText = asset.content_text;
    } else {
      if (customInputData.trim().length < 10) {
        alert("Please provide at least 10 characters of document input.");
        return;
      }
      payloadText = customInputData;
    }

    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const res = await apiRequest<{
        executionId: string;
        workflowId: string;
        workflowName: string;
        status: string;
        executionTimeMs: number;
        result: RiskReportResponse;
      }>("/workflows/execute", {
        method: "POST",
        body: JSON.stringify({
          workflowId: selectedWorkflow?.id || selectedWorkflowId,
          inputData: payloadText,
        }),
      });

      setExecutionResult({
        executionId: res.executionId,
        durationMs: res.executionTimeMs,
        status: res.status,
        report: res.result,
      });

      onExecutionCompleted();
    } catch (err: any) {
      alert(err.message || "Failed to execute workflow");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWfName || !newWfPrompt) return;

    setIsCreatingWf(true);
    try {
      const res = await apiRequest<{ workflow: AIWorkflow }>("/workflows", {
        method: "POST",
        body: JSON.stringify({
          name: newWfName,
          targetDepartment: newWfDept,
          systemPrompt: newWfPrompt,
        }),
      });

      setShowCreateModal(false);
      setNewWfName("");
      onWorkflowCreated();
      setSelectedWorkflowId(res.workflow.id);
    } catch (err: any) {
      alert(err.message || "Failed to create workflow");
    } finally {
      setIsCreatingWf(false);
    }
  };

  const copyJson = () => {
    if (!executionResult) return;
    navigator.clipboard.writeText(JSON.stringify(executionResult.report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getScoreColor = (score: number) => {
    if (score <= 3) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score <= 6) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">CRITICAL</span>;
      case "HIGH":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">HIGH</span>;
      case "MEDIUM":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">LOW</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PASS":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">PASS</span>;
      case "FAIL":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">FAIL</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">NEEDS REVIEW</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Selection & Trigger Bar */}
      <div className="glass-panel p-6 rounded-2xl relative">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Agentic Automation Engine
            </h2>
            <p className="text-xs text-slate-400">
              Configure and dispatch deterministic Gemini 2.5 Flash agents with strict OpenAPI schema validation.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            New Workflow Template
          </button>
        </div>

        {/* Workflow Template Selector Pills */}
        <div className="mb-6">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Select Active AI Workflow Agent
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {workflows.map((wf) => {
              const isSelected = (selectedWorkflow?.id || selectedWorkflowId) === wf.id;
              return (
                <button
                  key={wf.id}
                  type="button"
                  onClick={() => setSelectedWorkflowId(wf.id)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    isSelected
                      ? "bg-indigo-600/20 border-indigo-500/50 text-white shadow-glow"
                      : "bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                  }`}
                >
                  <p className="text-xs font-bold truncate mb-1">{wf.name}</p>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">
                    {wf.target_department || "General"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workflow Parameters & Input Payload Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-white/5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Input Payload Source
              </label>
              <div className="flex items-center rounded-lg bg-white/5 p-0.5 border border-white/5">
                <button
                  type="button"
                  onClick={() => setInputSource("asset")}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                    inputSource === "asset" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Knowledge Hub Asset
                </button>
                <button
                  type="button"
                  onClick={() => setInputSource("custom")}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                    inputSource === "custom" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Custom Payload Text
                </button>
              </div>
            </div>

            {inputSource === "asset" ? (
              <div className="space-y-2">
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="glass-input w-full px-3 py-2.5 rounded-xl text-xs bg-nexus-900"
                >
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.title} ({asset.department_tag || "General"} - {asset.classification.toUpperCase()})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  Pulls full authenticated document payload from isolated enterprise repository.
                </p>
              </div>
            ) : (
              <div>
                <textarea
                  rows={4}
                  value={customInputData}
                  onChange={(e) => setCustomInputData(e.target.value)}
                  placeholder="Paste contract clauses, financial spreadsheets, or vendor policy text to evaluate..."
                  className="glass-input w-full p-3 rounded-xl text-xs font-mono"
                ></textarea>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Configured System Prompt Directives
              </p>
              <div className="p-3 rounded-xl bg-nexus-950/60 border border-white/5 text-xs text-slate-300 font-mono leading-relaxed line-clamp-3">
                {selectedWorkflow?.system_prompt || "Execute rigorous analysis..."}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                Model: <span className="text-cyan-400 font-mono font-semibold">gemini-2.5-flash</span>
              </div>

              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-cyanGlow transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isExecuting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Synthesizing with Gemini...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    Execute AI Workflow
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Report Display */}
      {executionResult && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-indigo-500/30 shadow-glow animate-in fade-in">
          {/* Header */}
          <div className="p-5 border-b border-white/5 bg-nexus-900/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border font-mono font-extrabold text-lg ${getScoreColor(executionResult.report.overallRiskScore)}`}>
                {executionResult.report.overallRiskScore}/10
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Enterprise Audit & Synthesis Deliverable
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    COMPLETED
                  </span>
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Execution latency: <span className="font-mono text-slate-300 font-semibold">{executionResult.durationMs}ms</span>
                  <span>•</span>
                  <span>Execution ID: <span className="font-mono text-slate-400">{executionResult.executionId.substring(0, 8)}...</span></span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center rounded-lg bg-white/5 p-0.5 border border-white/5">
                <button
                  onClick={() => setReportTab("visual")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    reportTab === "visual" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Executive Report
                </button>
                <button
                  onClick={() => setReportTab("json")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                    reportTab === "json" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  JSON Spec
                </button>
              </div>

              <button
                onClick={copyJson}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
                title="Copy Raw JSON"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {reportTab === "visual" ? (
              <div className="space-y-6">
                {/* Executive Summary */}
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Executive Summary
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {executionResult.report.executiveSummary}
                  </p>
                </div>

                {/* Identified Risks Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Identified Operational & Legal Risks ({executionResult.report.identifiedRisks?.length || 0})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {executionResult.report.identifiedRisks?.map((risk, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-nexus-900/80 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-slate-200">{risk.riskType}</h5>
                          {getSeverityBadge(risk.severity)}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{risk.description}</p>
                        <div className="pt-2 border-t border-white/5 flex items-start gap-1.5 text-xs text-indigo-300">
                          <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span><strong>Action:</strong> {risk.remediationAction}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance Checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Governance & Policy Verification Checklist
                  </h4>
                  <div className="divide-y divide-white/5 rounded-xl border border-white/5 overflow-hidden">
                    {executionResult.report.complianceChecklist?.map((item, idx) => (
                      <div key={idx} className="p-3.5 bg-nexus-900/40 flex items-center justify-between">
                        <span className="text-xs text-slate-200 font-medium">{item.requirement}</span>
                        {getStatusBadge(item.status)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <pre className="p-4 rounded-xl bg-nexus-950 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed border border-white/5 max-h-96">
                  {JSON.stringify(executionResult.report, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 relative border border-white/10 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Create Enterprise AI Workflow</h3>
            <p className="text-xs text-slate-400 mb-4">
              Define a recurring AI task with department grounding and automated schema enforcement.
            </p>

            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Workflow Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vendor SLA & Risk Assessor"
                  value={newWfName}
                  onChange={(e) => setNewWfName(e.target.value)}
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Target Department
                </label>
                <select
                  value={newWfDept}
                  onChange={(e) => setNewWfDept(e.target.value)}
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs bg-nexus-900"
                >
                  <option value="Legal & Compliance">Legal & Compliance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Operations & Supply Chain">Operations & Supply Chain</option>
                  <option value="Sales & Customer Success">Sales & Customer Success</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  System Prompt Directive
                </label>
                <textarea
                  rows={4}
                  required
                  value={newWfPrompt}
                  onChange={(e) => setNewWfPrompt(e.target.value)}
                  className="glass-input w-full p-3 rounded-xl text-xs font-mono"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingWf}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow transition-all disabled:opacity-50"
                >
                  {isCreatingWf ? "Creating..." : "Save Workflow"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
