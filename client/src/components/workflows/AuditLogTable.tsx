import React, { useState } from "react";
import { Clock, ShieldCheck, FileText, ChevronRight, X, Copy, CheckCircle2 } from "lucide-react";
import type { WorkflowExecution } from "@nexusai/shared";

interface AuditLogTableProps {
  executions: WorkflowExecution[];
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ executions }) => {
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [copied, setCopied] = useState(false);

  const copyDetail = () => {
    if (!selectedExecution) return;
    navigator.clipboard.writeText(JSON.stringify(selectedExecution, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-3xl overflow-hidden glass-panel border border-gold-500/30 shadow-[0_0_35px_rgba(0,0,0,0.8)]">
      <div className="p-5 border-b border-gold-500/20 bg-[#050811]/90 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold font-quant text-white tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            Audit Ledger & Historical Covenant Executions
          </h3>
          <p className="text-[11px] text-slate-300">
            Immutable cryptographic audit trail for every contract review and automated AI covenant verification.
          </p>
        </div>
        <span className="text-[11px] font-quant font-bold px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-[#D4AF37]">
          {executions.length} Certified Records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-gold-500/20 font-quant">
            <tr>
              <th className="py-3.5 px-4">Date & Time</th>
              <th className="py-3.5 px-4">Audit Protocol</th>
              <th className="py-3.5 px-4">Executing Officer</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Latency</th>
              <th className="py-3.5 px-4 text-right">Ledger Record</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {executions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400 font-medium font-quant">
                  No automated audit executions logged to the Quantis ledger yet.
                </td>
              </tr>
            ) : (
              executions.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-quant text-[11px]">
                    {new Date(item.created_at).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {item.workflow_name || "Contract Risk Analyzer"}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-quant">
                    {item.executor_name || "Elena Vance"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-quant font-bold uppercase ${
                        item.status === "completed"
                          ? "bg-gold-500/15 text-[#D4AF37] border border-gold-500/30"
                          : item.status === "failed"
                          ? "bg-[#FF3366]/10 text-[#FF3366] border border-[#FF3366]/30"
                          : "bg-white/10 text-white border border-white/20"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-quant text-[11px]">
                    {item.execution_time_ms ? `${item.execution_time_ms}ms` : "1.2s"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedExecution(item)}
                      className="inline-flex items-center space-x-1 text-[11px] font-quant text-[#D4AF37] hover:text-white font-bold transition-colors"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Execution Detail Modal */}
      {selectedExecution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel border border-[#00E5FF]/40 rounded-3xl max-w-3xl w-full p-6 space-y-4 shadow-[0_0_50px_rgba(0,229,255,0.25)] flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div>
                <h4 className="text-base font-bold font-quant text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#00FFA3]" />
                  Audit Execution Telemetry ({selectedExecution.id.substring(0, 8)})
                </h4>
                <p className="text-[11px] text-slate-400 font-quant">
                  Recorded in ledger on {new Date(selectedExecution.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={copyDetail}
                  className="p-2 rounded-xl bg-black/60 hover:bg-black/90 text-slate-300 border border-white/10 transition-colors"
                  title="Copy Full JSON Payload"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-[#00FFA3]" /> : <Copy className="w-4 h-4 text-[#00E5FF]" />}
                </button>
                <button
                  onClick={() => setSelectedExecution(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div>
                <h5 className="text-[11px] font-quant font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Target Document Input Payload
                </h5>
                <pre className="p-3.5 rounded-2xl bg-black/60 text-slate-200 font-mono text-[11px] leading-relaxed border border-white/10 overflow-x-auto max-h-40">
                  {typeof selectedExecution.input_payload === "object"
                    ? JSON.stringify(selectedExecution.input_payload, null, 2)
                    : selectedExecution.input_payload}
                </pre>
              </div>

              <div>
                <h5 className="text-[11px] font-quant font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Structured AI Audit Response (Gemini 2.5 Flash)
                </h5>
                <pre className="p-3.5 rounded-2xl bg-black/60 text-[#00FFA3] font-mono text-[11px] leading-relaxed border border-white/10 overflow-x-auto max-h-60">
                  {typeof selectedExecution.ai_response === "object"
                    ? JSON.stringify(selectedExecution.ai_response, null, 2)
                    : selectedExecution.ai_response}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
