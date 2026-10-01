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
    if (score <= 3) return "text-emerald-800 border-emerald-300 bg-emerald-50";
    if (score <= 6) return "text-amber-800 border-amber-300 bg-amber-50";
    return "text-rose-800 border-rose-300 bg-rose-50";
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300 font-mono uppercase">CRITICAL</span>;
      case "HIGH":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 font-mono uppercase">HIGH</span>;
      case "MEDIUM":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 font-mono uppercase">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono uppercase">LOW</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PASS":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono uppercase">PASS</span>;
      case "FAIL":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 font-mono uppercase">FAIL</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 font-mono uppercase">NEEDS REVIEW</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Selection & Trigger Bar */}
      <div className="p-6 rounded-3xl bg-white border border-gold-300/80 shadow-luxuryCard relative">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-serif-luxury tracking-wide flex items-center gap-2">
              <Cpu className="w-5 h-5 text-gold-700" />
              Automated Fiduciary Auditor & Covenant Reviewer
            </h2>
            <p className="text-xs text-slate-500">
              Run automated AI compliance sweeps against counterparty contracts, credit facilities, and regulatory statutes.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-gold-50 text-slate-800 border border-gold-300/80 hover:border-gold-500 text-xs font-bold font-serif flex items-center gap-1.5 transition-all shadow-2xs hover:scale-105"
          >
            <Plus className="w-4 h-4 text-gold-700" />
            + Formulate Custom Audit
          </button>
        </div>

        {/* Workflow Template Selector Pills */}
        <div className="mb-6">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-serif mb-2">
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
                      ? "bg-gradient-to-r from-gold-600 to-amber-700 text-white border-gold-400 shadow-goldSoft"
                      : "bg-[#FCFBF8] border-gold-200 text-slate-700 hover:bg-gold-50 hover:text-slate-900 hover:border-gold-300 shadow-2xs hover:-translate-y-0.5"
                  }`}
                >
                  <p className={`text-xs font-bold truncate mb-1.5 font-serif ${isSelected ? "text-white" : "text-slate-900"}`}>{wf.name}</p>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                    isSelected ? "bg-gold-800/40 border-gold-300 text-gold-100" : "bg-gold-50 border-gold-200 text-gold-900"
                  }`}>
                    {wf.target_department || "General"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workflow Parameters & Input Payload Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-4 border-t border-gold-200/80">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-serif">
                2. Audit Target Document Payload:
              </label>
              <div className="flex items-center rounded-xl bg-[#FCFBF8] p-0.5 border border-gold-300/70 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setInputSource("asset")}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    inputSource === "asset" ? "gold-foil-btn text-white shadow-goldSoft" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Vault Record
                </button>
                <button
                  type="button"
                  onClick={() => setInputSource("custom")}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    inputSource === "custom" ? "gold-foil-btn text-white shadow-goldSoft" : "text-slate-600 hover:text-slate-900"
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
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#FCFBF8] text-slate-900 border border-gold-300/80 focus:outline-none focus:border-gold-500 shadow-2xs font-medium cursor-pointer"
                >
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.title} ({asset.department_tag || "General"} — {asset.classification.toUpperCase()})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                  <Database className="w-3.5 h-3.5 text-gold-700" />
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
                  className="w-full p-3 rounded-xl text-xs font-mono bg-[#FCFBF8] text-slate-900 border border-gold-300/80 focus:outline-none focus:border-gold-500 shadow-inner"
                ></textarea>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-serif mb-1.5">
                Active Audit Directives & System Prompts
              </p>
              <div className="p-3.5 rounded-xl bg-[#FCFBF8] border border-gold-200 text-xs text-slate-700 font-mono leading-relaxed line-clamp-3 shadow-inner">
                {selectedWorkflow?.system_prompt || "Execute rigorous analysis..."}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div className="text-[11px] text-slate-500">
                Inference Engine: <span className="text-gold-900 font-mono font-bold">Gemini 3.8 Flash</span>
              </div>

              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="px-6 py-2.5 rounded-xl gold-foil-btn text-white font-bold text-xs shadow-goldSoft transition-all disabled:opacity-50 flex items-center gap-2 hover:scale-105"
              >
                {isExecuting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sweeping Covenants with Gemini...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    ⚡ Run Sovereign Audit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Report Display */}
      {executionResult && (
        <div className="rounded-3xl overflow-hidden bg-white border border-gold-300/80 shadow-luxuryCard animate-in fade-in">
          {/* Header */}
          <div className="p-5 border-b border-gold-200/80 bg-[#FCFBF8] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border font-mono font-black ${getScoreColor(executionResult.report.overallRiskScore)}`}>
                <span className="text-lg leading-none">{executionResult.report.overallRiskScore}</span>
                <span className="text-[9px] uppercase font-sans font-bold">out of 10</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif-luxury tracking-wide flex items-center gap-2">
                  Fiduciary Audit & Risk Assessment Report
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 uppercase tracking-wider font-mono">
                    CERTIFIED COMPLETE
                  </span>
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-gold-700" />
                  Audited in <strong className="text-slate-800">{executionResult.durationMs}ms</strong>
                  <span>•</span>
                  <span>Ledger ID: <code className="text-slate-700 font-mono font-semibold">{executionResult.executionId.substring(0, 8)}</code></span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center rounded-xl bg-white p-0.5 border border-gold-300 shadow-2xs">
                <button
                  onClick={() => setReportTab("visual")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    reportTab === "visual" ? "gold-foil-btn text-white shadow-goldSoft" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Executive Brief
                </button>
                <button
                  onClick={() => setReportTab("json")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    reportTab === "json" ? "gold-foil-btn text-white shadow-goldSoft" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  Raw Ledger JSON
                </button>
              </div>

              <button
                onClick={copyJson}
                className="p-2 rounded-xl bg-white hover:bg-gold-50 text-slate-700 border border-gold-300/80 transition-colors shadow-2xs"
                title="Copy Raw JSON"
              >
                <Copy className="w-4 h-4 text-gold-700" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {reportTab === "visual" ? (
              <div className="space-y-6">
                {/* Executive Summary */}
                <div className="p-5 rounded-2xl bg-gold-50/70 border border-gold-300/60 shadow-inner">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold-900 font-serif mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-700" />
                    Fiduciary Findings & Executive Synthesis
                  </h4>
                  <p className="text-sm text-slate-800 leading-relaxed font-sans">
                    {executionResult.report.executiveSummary}
                  </p>
                </div>

                {/* Identified Risks Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-serif mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Identified Operational & Legal Vulnerabilities ({executionResult.report.identifiedRisks?.length || 0})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {executionResult.report.identifiedRisks?.map((risk, idx) => (
                      <div key={idx} className="gold-card-sheen p-4 rounded-2xl bg-white border border-gold-300/70 hover:border-gold-500 hover:shadow-cardHover transition-all space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-slate-900 font-serif">{risk.riskType}</h5>
                          {getSeverityBadge(risk.severity)}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{risk.description}</p>
                        <div className="pt-2 border-t border-gold-100 flex items-start gap-1.5 text-xs text-gold-950 font-medium">
                          <ArrowRight className="w-3.5 h-3.5 text-gold-700 shrink-0 mt-0.5" />
                          <span><strong>Mandated Remedy:</strong> {risk.remediationAction}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance Checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-serif mb-3 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Statutory & Governance Verification Checklist
                  </h4>
                  <div className="divide-y divide-gold-100 rounded-2xl border border-gold-300/70 overflow-hidden bg-white shadow-2xs">
                    {executionResult.report.complianceChecklist?.map((item, idx) => (
                      <div key={idx} className="p-3.5 bg-white hover:bg-gold-50/40 flex items-center justify-between transition-colors">
                        <span className="text-xs text-slate-800 font-medium">{item.requirement}</span>
                        {getStatusBadge(item.status)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <pre className="p-4 rounded-2xl bg-[#FCFBF8] font-mono text-xs text-slate-900 overflow-x-auto leading-relaxed border border-gold-200 max-h-96 shadow-inner">
                  {JSON.stringify(executionResult.report, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 relative border border-gold-300 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 font-serif-luxury mb-1">Formulate Fiduciary Review Workflow</h3>
            <p className="text-xs text-slate-500 mb-4">
              Define a tailored AI analysis protocol with departmental jurisdiction and structured verification rules.
            </p>

            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-serif mb-1">
                  Workflow Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Counterparty Credit & Indemnification Reviewer"
                  value={newWfName}
                  onChange={(e) => setNewWfName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#FCFBF8] text-slate-900 border border-gold-300/80 focus:outline-none focus:border-gold-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-serif mb-1">
                  Jurisdictional Department
                </label>
                <select
                  value={newWfDept}
                  onChange={(e) => setNewWfDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#FCFBF8] text-slate-900 border border-gold-300/80 focus:outline-none focus:border-gold-500 shadow-2xs font-medium cursor-pointer"
                >
                  <option value="Legal & Compliance">Legal & Compliance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Operations & Supply Chain">Operations & Supply Chain</option>
                  <option value="Sales & Customer Success">Sales & Customer Success</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-serif mb-1">
                  Compliance Directives & Statutory Focus
                </label>
                <textarea
                  rows={4}
                  required
                  value={newWfPrompt}
                  onChange={(e) => setNewWfPrompt(e.target.value)}
                  className="w-full p-3.5 rounded-xl text-xs font-mono leading-relaxed bg-[#FCFBF8] text-slate-900 border border-gold-300/80 focus:outline-none focus:border-gold-500 shadow-inner"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-gold-50 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingWf}
                  className="px-5 py-2.5 rounded-xl gold-foil-btn text-white font-bold text-xs shadow-goldSoft transition-all disabled:opacity-50"
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
