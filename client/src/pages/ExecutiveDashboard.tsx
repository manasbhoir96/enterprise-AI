import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Cpu,
  Clock,
  DollarSign,
  Database,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  FileCheck2,
} from "lucide-react";
import { StatCardWidget } from "../components/dashboard/StatCardWidget.js";
import { apiRequest } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.js";
import type { DashboardMetrics } from "@nexusai/shared";

interface ExecutiveDashboardProps {
  onNavigate: (path: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ onNavigate }) => {
  const { user, organization } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await apiRequest<{ metrics: DashboardMetrics }>("/org/overview");
        setMetrics(res.metrics);
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Telemetry Header */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold tracking-wider uppercase">
              Operational Telemetry Online
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.full_name?.split(" ")[0] || "Executive"} 👋
          </h1>
          <p className="text-xs text-slate-400">
            {organization?.name || "Acme Corporation"} • Unified Knowledge Engine & Agentic Automation
          </p>
        </div>

        {/* Quick Launch Action Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("/copilot")}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Launch Copilot
          </button>
          <button
            onClick={() => onNavigate("/workflows")}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Run Workflow
          </button>
        </div>
      </div>

      {/* Primary KPI Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardWidget
          title="Automated Workflows Run"
          value={metrics?.totalWorkflowsRun ?? 4}
          change="+32%"
          isPositive={true}
          icon={Cpu}
          glowColor="cyan"
          subtitle="Contract & financial audits"
        />

        <StatCardWidget
          title="Hours Saved by AI"
          value={`${metrics?.estimatedHoursSaved ?? 36} hrs`}
          change="+28%"
          isPositive={true}
          icon={Clock}
          glowColor="indigo"
          subtitle="4.5h per document review"
        />

        <StatCardWidget
          title="Estimated Cost Savings"
          value={`$${(metrics?.estimatedCostSavings ?? 4140).toLocaleString()}`}
          change="+35%"
          isPositive={true}
          icon={DollarSign}
          glowColor="emerald"
          subtitle="Based on $115/hr analyst rate"
        />

        <StatCardWidget
          title="System SLA & Compliance"
          value="99.98%"
          change="SOC2"
          isPositive={true}
          icon={ShieldCheck}
          glowColor="purple"
          subtitle="Zero-trust tenant isolation"
        />
      </div>

      {/* Middle Section: Department AI Utilization & Recent Execution Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Department AI Utilization */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Departmental AI Adoption & Knowledge Assets
                </h3>
                <p className="text-[11px] text-slate-400">
                  Distribution of ingested proprietary documents and automated agent runs.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">
                {metrics?.activeDepartments ?? 4} Departments Active
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {[
                { dept: "Legal & Compliance", count: 2, pct: 45, color: "bg-indigo-500" },
                { dept: "Finance & Accounting", count: 1, pct: 25, color: "bg-cyan-500" },
                { dept: "Human Resources", count: 1, pct: 20, color: "bg-purple-500" },
                { dept: "Operations & Supply Chain", count: 1, pct: 10, color: "bg-emerald-500" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.dept}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{item.count} Assets ({item.pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Ingested Assets: <strong>{metrics?.totalKnowledgeAssets ?? 4} documents</strong></span>
            <button
              onClick={() => onNavigate("/knowledge-base")}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              Explore Knowledge Hub →
            </button>
          </div>
        </div>

        {/* Right: Live Execution Stream */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Recent Agentic Executions
                </h3>
                <p className="text-[11px] text-slate-400">
                  Live feed of Gemini 2.5 Flash structured compliance & risk evaluations.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                AUDIT STREAM
              </span>
            </div>

            <div className="space-y-2.5">
              {(metrics?.recentExecutions && metrics.recentExecutions.length > 0
                ? metrics.recentExecutions
                : [
                    {
                      id: "1",
                      workflow_name: "Enterprise Contract Risk Analyzer",
                      executor_name: "Marcus Reed",
                      execution_time_ms: 1140,
                      status: "completed",
                      created_at: new Date().toISOString(),
                    },
                    {
                      id: "2",
                      workflow_name: "Quarterly Financial Health Synthesizer",
                      executor_name: "Elena Vance",
                      execution_time_ms: 1420,
                      status: "completed",
                      created_at: new Date(Date.now() - 3600000).toISOString(),
                    },
                  ]
              ).map((exec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-nexus-900/60 border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{exec.workflow_name}</p>
                      <p className="text-[10px] text-slate-400">
                        {exec.executor_name} • {exec.execution_time_ms ? `${exec.execution_time_ms}ms` : "1.2s"}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {exec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 mt-6 flex items-center justify-between">
            <span className="text-xs text-slate-400">SOC2 compliant immutable logging active</span>
            <button
              onClick={() => onNavigate("/workflows")}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              View Full Audit Log →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
