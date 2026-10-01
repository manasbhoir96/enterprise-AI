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
    <div className="rounded-3xl overflow-hidden bg-white border border-gold-300/80 shadow-luxuryCard">
      <div className="p-5 border-b border-gold-200/80 bg-[#FCFBF8] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-serif-luxury tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold-700" />
            Audit Ledger & Historical Covenant Executions
          </h3>
          <p className="text-[11px] text-slate-500">
            Immutable cryptographic audit trail for every contract review and automated AI covenant verification.
          </p>
        </div>
        <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-gold-50 border border-gold-300 text-gold-900 shadow-2xs">
          {executions.length} Certified Records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F5] text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-gold-200 font-serif">
            <tr>
              <th className="py-3.5 px-4">Date & Time</th>
              <th className="py-3.5 px-4">Audit Protocol</th>
              <th className="py-3.5 px-4">Executing Officer</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Latency</th>
              <th className="py-3.5 px-4 text-right">Ledger Record</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-100">
            {executions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400 font-medium">
                  No automated audit executions logged to the sovereign ledger yet.
                </td>
              </tr>
            ) : (
              executions.map((item) => (
                <tr key={item.id} className="hover:bg-gold-50/40 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(item.created_at).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 font-serif">
                    {item.workflow_name || "Enterprise Analysis"}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {item.executor_name || "System Admin"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border font-mono ${
                        item.status === "completed"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : item.status === "failed"
                          ? "bg-rose-50 text-rose-800 border-rose-300"
                          : "bg-gold-50 text-gold-900 border-gold-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                    {item.execution_time_ms ? `${item.execution_time_ms}ms` : "—"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedExecution(item)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-gold-50 text-slate-800 border border-gold-200 hover:border-gold-400 text-[11px] font-semibold transition-all shadow-2xs inline-flex items-center gap-1 hover:scale-105"
                    >
                      <span>Examine</span>
                      <ChevronRight className="w-3 h-3 text-gold-700" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inspect Execution Modal */}
      {selectedExecution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 relative border border-gold-300 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gold-200/80 mb-4">
              <div>
                <h4 className="text-base font-bold text-slate-900 font-serif-luxury flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold-700" />
                  Audit Execution Telemetry ({selectedExecution.id.substring(0, 8)})
                </h4>
                <p className="text-[11px] text-slate-500">
                  Recorded in ledger on {new Date(selectedExecution.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={copyDetail}
                  className="p-2 rounded-xl bg-white hover:bg-gold-50 text-slate-700 border border-gold-200 transition-colors shadow-2xs"
                  title="Copy Full JSON Payload"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gold-700" />}
                </button>
                <button
                  onClick={() => setSelectedExecution(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-gold-50 border border-transparent hover:border-gold-200 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-serif mb-1">
                  Target Document Input Payload
                </h5>
                <pre className="p-3.5 rounded-2xl bg-[#FCFBF8] text-slate-800 font-mono text-[11px] leading-relaxed border border-gold-200 overflow-x-auto max-h-40 shadow-inner">
                  {typeof selectedExecution.input_payload === "object"
                    ? JSON.stringify(selectedExecution.input_payload, null, 2)
                    : selectedExecution.input_payload}
                </pre>
              </div>

              <div>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-serif mb-1">
                  Structured AI Audit Response (Gemini 3.8 Flash)
                </h5>
                <pre className="p-3.5 rounded-2xl bg-[#FCFBF8] text-gold-950 font-mono text-[11px] leading-relaxed border border-gold-200 overflow-x-auto max-h-60 shadow-inner">
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
