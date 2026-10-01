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
    if (score <= 3) return "text-[#00FFA3] border-[#00FFA3]/40 bg-[#00FFA3]/10";
    if (score <= 6) return "text-[#D4AF37] border-gold-500/40 bg-gold-500/15";
    return "text-[#FF3366] border-[#FF3366]/40 bg-[#FF3366]/15";
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF3366]/15 text-[#FF3366] border border-[#FF3366]/40 font-quant uppercase">CRITICAL</span>;
      case "HIGH":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 font-quant uppercase">HIGH</span>;
      case "MEDIUM":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-quant uppercase">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-500/15 text-[#D4AF37] border border-gold-500/30 font-quant uppercase">LOW</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PASS":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-500/15 text-[#D4AF37] border border-gold-500/40 font-quant uppercase">PASS</span>;
      case "FAIL":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF3366]/15 text-[#FF3366] border border-[#FF3366]/30 font-quant uppercase">FAIL</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-quant uppercase">NEEDS REVIEW</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Selection & Trigger Bar */}
      <div className="p-6 rounded-3xl glass-panel border border-gold-500/30 shadow-[0_0_35px_rgba(0,0,0,0.8)] relative">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white font-quant tracking-wide flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#D4AF37]" />
              Automated Fiduciary Auditor & Covenant Reviewer
            </h2>
            <p className="text-xs text-slate-300">
              Run automated AI compliance sweeps against counterparty contracts, credit facilities, and regulatory statutes.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="gold-foil-btn px-4 py-2 rounded-xl text-white text-xs font-bold font-quant flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 text-white" />
            + Formulate Custom Audit
          </button>
        </div>

        {/* Workflow Template Selector Pills */}
        <div className="mb-6">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 font-quant mb-2">
            1. Select Fiduciary Audit Protocol:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {workflows.map((wf) => {
              const isSelected = (selectedWorkflow?.id || selectedWorkflowId) === wf.id;
              return (
                <button
                  key={wf.id}
                  type="button"
                  onClick={() => setSelectedWorkflowId(wf.id)}
                  className={`p-4 rounded-2xl text-left transition-all border ${
                    isSelected
                      ? "bg-gold-500/20 text-white border-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.3)] font-semibold"
                      : "bg-black/40 border-gold-500/20 text-slate-300 hover:bg-black/60 hover:text-white hover:border-gold-500/50 shadow-2xs hover:-translate-y-0.5"
                  }`}
                >
                  <p className={`text-xs font-bold truncate mb-1.5 font-quant ${isSelected ? "text-white" : "text-slate-100"}`}>{wf.name}</p>
                  <span className={`text-[10px] font-quant font-bold px-2 py-0.5 rounded-md border ${
                    isSelected ? "bg-gold-500/30 border-gold-400 text-white" : "bg-gold-500/10 border-gold-500/20 text-[#D4AF37]"
                  }`}>
                    {wf.target_department || "General"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workflow Parameters & Input Payload Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-4 border-t border-gold-500/20">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-quant">
                2. Audit Target Document Payload:
              </label>
              <div className="flex items-center rounded-xl bg-black/60 p-0.5 border border-gold-500/20 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setInputSource("asset")}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    inputSource === "asset" ? "gold-foil-btn text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Vault Record
                </button>
                <button
                  type="button"
                  onClick={() => setInputSource("custom")}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    inputSource === "custom" ? "gold-foil-btn text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Raw Contract Text
                </button>
              </div>
            </div>

            {inputSource === "asset" ? (
              <div className="space-y-2">
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input text-white focus:outline-none focus:border-gold-500 shadow-2xs font-medium cursor-pointer"
                >
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id} className="bg-[#0B0F19]">
                      {asset.title} ({asset.department_tag || "General"} — {asset.classification.toUpperCase()})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                  <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Pulls cryptographically verified covenant instrument from isolated enterprise vault.
                </p>
              </div>
            ) : (
              <div>
                <textarea
                  rows={4}
                  value={customInputData}
                  onChange={(e) => setCustomInputData(e.target.value)}
                  placeholder="Paste contract clauses, financial spreadsheets, or vendor policy text to evaluate..."
                  className="w-full p-3 rounded-xl text-xs font-mono glass-input text-white focus:outline-none focus:border-gold-500 shadow-inner"
                ></textarea>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-quant mb-1.5">
                Active Audit Directives & System Prompts
              </p>
              <div className="p-3.5 rounded-xl bg-black/60 border border-gold-500/20 text-xs text-slate-300 font-mono leading-relaxed line-clamp-3 shadow-inner">
                {selectedWorkflow?.system_prompt || "Execute rigorous analysis..."}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div className="text-[11px] text-slate-300">
                Inference Engine: <span className="text-[#D4AF37] font-quant font-bold">Gemini 2.5 Flash</span>
              </div>

              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="px-6 py-2.5 rounded-xl gold-foil-btn text-white font-bold text-xs font-quant transition-all disabled:opacity-50 flex items-center gap-2 hover:scale-105"
              >
                {isExecuting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Executing Agentic DAG...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    ⚡ Run Agentic Risk Sweep
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Report Display */}
      {executionResult && (
        <div className="rounded-3xl overflow-hidden glass-panel border border-gold-500/30 shadow-[0_0_35px_rgba(0,0,0,0.8)] animate-in fade-in">
          {/* Header */}
          <div className="p-5 border-b border-gold-500/20 bg-[#050811]/90 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border font-quant font-black ${getScoreColor(executionResult.report.overallRiskScore)}`}>
                <span className="text-lg leading-none">{executionResult.report.overallRiskScore}</span>
                <span className="text-[9px] uppercase font-quant font-bold">out of 10</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-quant tracking-wide flex items-center gap-2">
                  Fiduciary Audit & Risk Assessment Report
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gold-500/15 text-[#D4AF37] border border-gold-500/30 uppercase tracking-wider font-quant">
                    CERTIFIED COMPLETE
                  </span>
                </h3>
                <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Audited in <strong className="text-white">{executionResult.durationMs}ms</strong>
                  <span>•</span>
                  <span>Ledger ID: <code className="text-slate-300 font-mono font-semibold">{executionResult.executionId.substring(0, 8)}</code></span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center rounded-xl bg-black/60 p-0.5 border border-gold-500/20 shadow-2xs">
                <button
                  onClick={() => setReportTab("visual")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    reportTab === "visual" ? "gold-foil-btn text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Executive Brief
                </button>
                <button
                  onClick={() => setReportTab("json")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    reportTab === "json" ? "gold-foil-btn text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  Raw Ledger JSON
                </button>
              </div>

              <button
                onClick={copyJson}
                className="p-2 rounded-xl bg-black/60 hover:bg-black/90 text-[#D4AF37] border border-gold-500/30 transition-colors shadow-2xs"
                title="Copy Raw JSON"
              >
                <Copy className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {reportTab === "visual" ? (
              <div className="space-y-6">
                {/* Executive Summary */}
                <div className="p-5 rounded-2xl bg-black/50 border border-gold-500/25 shadow-inner">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] font-quant mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Fiduciary Findings & Executive Synthesis
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-sans">
                    {executionResult.report.executiveSummary}
                  </p>
                </div>

                {/* Identified Risks Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-quant mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Identified Operational & Legal Vulnerabilities ({executionResult.report.identifiedRisks?.length || 0})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {executionResult.report.identifiedRisks?.map((risk, idx) => (
                      <div key={idx} className="glass-panel p-4 rounded-2xl border border-gold-500/20 hover:border-gold-500/40 transition-all space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-white font-quant">{risk.riskType}</h5>
                          {getSeverityBadge(risk.severity)}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{risk.description}</p>
                        <div className="pt-2 border-t border-gold-500/15 flex items-start gap-1.5 text-xs text-slate-200 font-medium">
                          <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span><strong className="text-[#D4AF37]">Mandated Remedy:</strong> {risk.remediationAction}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance Checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-quant mb-3 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#00FFA3]" />
                    Statutory & Governance Verification Checklist
                  </h4>
                  <div className="divide-y divide-gold-500/15 rounded-2xl border border-gold-500/20 overflow-hidden bg-black/40 shadow-2xs">
                    {executionResult.report.complianceChecklist?.map((item, idx) => (
                      <div key={idx} className="p-3.5 bg-transparent hover:bg-white/[0.03] flex items-center justify-between transition-colors">
                        <span className="text-xs text-slate-200 font-medium">{item.requirement}</span>
                        {getStatusBadge(item.status)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <pre className="p-4 rounded-2xl bg-black/80 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed border border-gold-500/20 max-h-96 shadow-inner">
                  {JSON.stringify(executionResult.report, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 relative border border-gold-500/40 shadow-[0_0_50px_rgba(212,175,55,0.3)] bg-[#0B0F19]/95 text-white">
            <h3 className="text-base font-bold text-white font-quant mb-1">Formulate Fiduciary Review Workflow</h3>
            <p className="text-xs text-slate-300 mb-4">
              Define a tailored AI analysis protocol with departmental jurisdiction and structured verification rules.
            </p>

            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 font-quant mb-1">
                  Workflow Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Counterparty Credit & Indemnification Reviewer"
                  value={newWfName}
                  onChange={(e) => setNewWfName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input text-white focus:outline-none focus:border-gold-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 font-quant mb-1">
                  Jurisdictional Department
                </label>
                <select
                  value={newWfDept}
                  onChange={(e) => setNewWfDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input text-white focus:outline-none focus:border-gold-500 shadow-2xs font-medium cursor-pointer"
                >
                  <option value="Legal & Compliance" className="bg-[#0B0F19]">Legal & Compliance</option>
                  <option value="Human Resources" className="bg-[#0B0F19]">Human Resources</option>
                  <option value="Finance & Accounting" className="bg-[#0B0F19]">Finance & Accounting</option>
                  <option value="Operations & Supply Chain" className="bg-[#0B0F19]">Operations & Supply Chain</option>
                  <option value="Sales & Customer Success" className="bg-[#0B0F19]">Sales & Customer Success</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 font-quant mb-1">
                  Compliance Directives & Statutory Focus
                </label>
                <textarea
                  rows={4}
                  required
                  value={newWfPrompt}
                  onChange={(e) => setNewWfPrompt(e.target.value)}
                  className="w-full p-3.5 rounded-xl text-xs font-mono leading-relaxed glass-input text-white focus:outline-none focus:border-gold-500 shadow-inner"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingWf}
                  className="px-5 py-2.5 rounded-xl gold-foil-btn text-white font-bold text-xs transition-all disabled:opacity-50"
                >
                  {isCreatingWf ? "Registering..." : "Confirm & Save Protocol"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
