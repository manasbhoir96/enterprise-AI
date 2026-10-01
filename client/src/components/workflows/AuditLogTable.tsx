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
    <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-xl">
      <div className="p-4 border-b border-white/5 bg-nexus-900/60 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Review History & Activity Trail
          </h3>
          <p className="text-[11px] text-slate-300">
            Complete record of every contract review and automated AI audit.
          </p>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
          {executions.length} Completed Reviews
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-nexus-900/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-white/5">
            <tr>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Review Type</th>
              <th className="py-3 px-4">Run By</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Speed</th>
              <th className="py-3 px-4 text-right">View Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {executions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No automated workflow executions recorded yet.
                </td>
              </tr>
            ) : (
              executions.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(item.created_at).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200">
                    {item.workflow_name || "Enterprise Analysis"}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {item.executor_name || "System Admin"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        item.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          : item.status === "failed"
                          ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                          : "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {item.execution_time_ms ? `${item.execution_time_ms}ms` : "—"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedExecution(item)}
                      className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="w-3 h-3 text-slate-500" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 relative border border-white/10 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Audit Execution Telemetry ({selectedExecution.id.substring(0, 8)})
                </h4>
                <p className="text-[11px] text-slate-400">
                  Logged on {new Date(selectedExecution.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={copyDetail}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                  title="Copy Full JSON Payload"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setSelectedExecution(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div>
                <h5 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Input Document Payload
                </h5>
                <pre className="p-3 rounded-xl bg-nexus-950 text-slate-300 font-mono text-[11px] leading-relaxed border border-white/5 overflow-x-auto max-h-40">
                  {typeof selectedExecution.input_payload === "object"
                    ? JSON.stringify(selectedExecution.input_payload, null, 2)
                    : selectedExecution.input_payload}
                </pre>
              </div>

              <div>
                <h5 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Structured AI Response Output
                </h5>
                <pre className="p-3 rounded-xl bg-nexus-950 text-emerald-400 font-mono text-[11px] leading-relaxed border border-white/5 overflow-x-auto max-h-60">
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
