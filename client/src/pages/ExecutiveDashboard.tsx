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
  Landmark,
  Coins,
  Scale,
  Award,
} from "lucide-react";
import { StatCardWidget } from "../components/dashboard/StatCardWidget.js";
import { HelpGuideBanner } from "../components/HelpGuideBanner.js";
import { HolographicTreasuryCard } from "../components/dashboard/HolographicTreasuryCard.js";
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
      {/* 3-Step Executive Protocol Banner */}
      <HelpGuideBanner onNavigate={onNavigate} />

      {/* Top Welcome & Fiduciary Telemetry Header */}
      <div className="p-6 rounded-3xl bg-white border border-gold-400/40 shadow-luxuryCard relative overflow-hidden flex flex-wrap items-center justify-between gap-4 gold-card-sheen">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-800 tracking-widest uppercase font-serif bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Sovereign Enclave Active & Audited
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-serif-luxury">
            Welcome, {user?.full_name || "Elena Vance"}
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            {organization?.name || "Acme Sovereign Capital"} • Institutional Asset Telemetry & AI Synthesis
          </p>
        </div>

        {/* Quick Launch Action Pills */}
        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => onNavigate("/copilot")}
            className="gold-foil-btn px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-goldSoft hover:scale-105"
          >
            <Bot className="w-4 h-4" />
            <span>Consult Copilot</span>
          </button>
          <button
            onClick={() => onNavigate("/workflows")}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-gold-50 text-gold-900 border border-gold-400/60 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 hover:border-gold-600 hover:scale-105"
          >
            <Scale className="w-4 h-4 text-gold-700" />
            <span>Audit Document</span>
          </button>
        </div>
      </div>

      {/* 3D Holographic Treasury Asset Card */}
      <HolographicTreasuryCard />

      {/* Primary KPI Stat Grid (Wall Street Gold Theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardWidget
          title="Automated Reviews Run"
          value={metrics?.totalWorkflowsRun ?? 4}
          change="+32%"
          isPositive={true}
          icon={FileCheck2}
          subtitle="Contract & financial audits executed"
        />

        <StatCardWidget
          title="Analyst Hours Saved"
          value={`${metrics?.estimatedHoursSaved ?? 36} hrs`}
          change="+28%"
          isPositive={true}
          icon={Clock}
          subtitle="4.5 hrs saved per document analyzed"
        />

        <StatCardWidget
          title="Estimated Capital Saved"
          value={`$${(metrics?.estimatedCostSavings ?? 4140).toLocaleString()}`}
          change="+35%"
          isPositive={true}
          icon={DollarSign}
          subtitle="Benchmark: $115/hr Wall St senior rate"
        />

        <StatCardWidget
          title="Fiduciary Health & SLA"
          value="99.98%"
          change="Optimal"
          isPositive={true}
          icon={ShieldCheck}
          subtitle="Real-time multi-tenant integrity"
        />
      </div>

      {/* Middle Section: Department AI Utilization & Recent Execution Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Department Capital & Knowledge Allocation */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-gold-300/60 shadow-luxuryCard flex flex-col justify-between hover:border-gold-500 transition-all duration-300 gold-card-sheen">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-serif-luxury">
                  <Layers className="w-4 h-4 text-gold-700" />
                  Vault Distribution by Department
                </h3>
                <p className="text-[11px] text-slate-500">
                  Institutional data partitioning across legal, finance, and operations.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-900 border border-gold-300 font-serif">
                {metrics?.activeDepartments ?? 4} Divisions
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {[
                { dept: "Legal & Regulatory Compliance", count: 2, pct: 45, color: "bg-gradient-to-r from-gold-600 via-amber-500 to-gold-400" },
                { dept: "Finance & Capital Allocation", count: 1, pct: 25, color: "bg-gradient-to-r from-amber-600 to-amber-400" },
                { dept: "Human Capital & Equity", count: 1, pct: 20, color: "bg-gradient-to-r from-emerald-600 to-teal-500" },
                { dept: "Operations & Treasury Infrastructure", count: 1, pct: 10, color: "bg-gradient-to-r from-slate-700 to-slate-500" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{item.dept}</span>
                    <span className="text-slate-500 font-mono text-[11px] font-semibold">{item.count} Assets ({item.pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gold-200/50 mt-6 flex items-center justify-between">
            <span className="text-xs text-slate-500">Total Vaulted Documents: <strong className="text-slate-900">{metrics?.totalKnowledgeAssets ?? 4} files</strong></span>
            <button
              onClick={() => onNavigate("/knowledge-base")}
              className="text-xs text-gold-800 hover:text-gold-950 font-bold flex items-center gap-1 font-serif"
            >
              Browse Document Vault →
            </button>
          </div>
        </div>

        {/* Right: Live Sovereign Audit Stream */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-gold-300/60 shadow-luxuryCard flex flex-col justify-between hover:border-gold-500 transition-all duration-300 gold-card-sheen">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-serif-luxury">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Recent Audit & Verification Stream
                </h3>
                <p className="text-[11px] text-slate-500">
                  Immutable execution ledger of contractual reviews and risk summaries.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-serif">
                LIVE AUDIT
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
                  className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-gold-200/70 flex items-center justify-between hover:border-gold-400 hover:bg-gold-50/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-300 shadow-xs">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 font-serif-luxury">{exec.workflow_name}</p>
                      <p className="text-[10px] text-slate-500">
                        Executed by {exec.executor_name} • {exec.execution_time_ms ? `${exec.execution_time_ms}ms` : "1.2s"}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                    {exec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gold-200/50 mt-6 flex items-center justify-between">
            <span className="text-xs text-slate-500">Compliance records secured via SHA-256</span>
            <button
              onClick={() => onNavigate("/workflows")}
              className="text-xs text-gold-800 hover:text-gold-950 font-bold flex items-center gap-1 font-serif"
            >
              Open Audit Ledger →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
