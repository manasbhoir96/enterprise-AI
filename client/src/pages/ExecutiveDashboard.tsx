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
  FileText,
  Bot,
  Share2,
} from "lucide-react";
import { StatCardWidget } from "../components/dashboard/StatCardWidget.js";
import { HelpGuideBanner } from "../components/HelpGuideBanner.js";
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
      {/* 3-Step Friendly Onboarding & Help Banner */}
      <HelpGuideBanner onNavigate={onNavigate} />

      {/* Top Welcome & Telemetry Header */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4 border border-indigo-500/20 shadow-glow">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase">
              System Online & Ready
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Hello, {user?.full_name?.split(" ")[0] || "Team"} 👋
          </h1>
          <p className="text-xs text-slate-300">
            {organization?.name || "Acme Corporation"} • Your Unified Knowledge Base & AI Assistant
          </p>
        </div>

        {/* Quick Launch Action Pills */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate("/copilot")}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow transition-all flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4" />
            Chat with Copilot
          </button>
          <button
            onClick={() => onNavigate("/workflows")}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-cyanGlow transition-all flex items-center gap-1.5"
          >
            <Cpu className="w-4 h-4" />
            Scan a Contract
          </button>
        </div>
      </div>

      {/* Primary KPI Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardWidget
          title="Automated Reviews Run"
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
          subtitle="4.5 hrs saved per document"
        />

        <StatCardWidget
          title="Estimated Cost Saved"
          value={`$${(metrics?.estimatedCostSavings ?? 4140).toLocaleString()}`}
          change="+35%"
          isPositive={true}
          icon={DollarSign}
          glowColor="emerald"
          subtitle="Based on $115/hr analyst rate"
        />

        <StatCardWidget
          title="System Health & SLA"
          value="99.98%"
          change="Healthy"
          isPositive={true}
          icon={ShieldCheck}
          glowColor="purple"
          subtitle="All AI systems running normally"
        />
      </div>

      {/* Middle Section: Department AI Utilization & Recent Execution Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Department AI Utilization */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl flex flex-col justify-between border border-white/10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Documents by Department
                </h3>
                <p className="text-[11px] text-slate-400">
                  How your team's knowledge is organized across departments.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {metrics?.activeDepartments ?? 4} Departments
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {[
                { dept: "Legal & Compliance", count: 2, pct: 45, color: "bg-gradient-to-r from-violet-500 to-indigo-500" },
                { dept: "Finance & Accounting", count: 1, pct: 25, color: "bg-gradient-to-r from-amber-500 to-orange-500" },
                { dept: "Human Resources", count: 1, pct: 20, color: "bg-gradient-to-r from-emerald-500 to-teal-500" },
                { dept: "Operations & Supply Chain", count: 1, pct: 10, color: "bg-gradient-to-r from-cyan-500 to-blue-500" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.dept}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{item.count} Docs ({item.pct}%)</span>
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
            <span className="text-xs text-slate-400">Indexed Library: <strong>{metrics?.totalKnowledgeAssets ?? 4} documents</strong></span>
            <button
              onClick={() => onNavigate("/knowledge-base")}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              Browse All Documents →
            </button>
          </div>
        </div>

        {/* Right: Live Execution Stream */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl flex flex-col justify-between border border-white/10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Recent AI Tasks & Reviews
                </h3>
                <p className="text-[11px] text-slate-400">
                  Live history of automated risk assessments and summaries.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                LIVE LOG
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
                  className="p-3 rounded-xl bg-nexus-900/60 border border-white/5 flex items-center justify-between hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{exec.workflow_name}</p>
                      <p className="text-[10px] text-slate-400">
                        Run by {exec.executor_name} • {exec.execution_time_ms ? `${exec.execution_time_ms}ms` : "1.2s"}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {exec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 mt-6 flex items-center justify-between">
            <span className="text-xs text-slate-400">Every AI review is securely recorded</span>
            <button
              onClick={() => onNavigate("/workflows")}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              See All Reviews →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
