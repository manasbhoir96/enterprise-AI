import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Cpu,
  Clock,
  DollarSign,
  Database,
  ShieldCheck,
  TrendingUp,
  Activity,
  Layers,
  FileCheck2,
  FileText,
  Bot,
  Zap,
  Lock,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { StatCardWidget } from "../components/dashboard/StatCardWidget.js";
import { Interactive3DHologram } from "../components/dashboard/Interactive3DHologram.js";
import { NeonLaserChart } from "../components/dashboard/NeonLaserChart.js";
import { EnterpriseAiShowcase } from "../components/dashboard/EnterpriseAiShowcase.js";
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
      {/* Top Welcome & Holographic Telemetry Header */}
      <div className="p-6 rounded-3xl glass-panel relative overflow-hidden border border-[#00E5FF]/25 shadow-[0_0_35px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-4">
        {/* Laser Scanning overlay */}
        <div className="absolute inset-0 hologram-laser-sweep pointer-events-none" />

        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FFA3] animate-pulse" />
            <span className="text-[10px] font-quant font-bold text-[#00FFA3] tracking-widest uppercase bg-[#00FFA3]/10 px-2.5 py-0.5 rounded-md border border-[#00FFA3]/30 shadow-[0_0_10px_rgba(0,255,163,0.2)]">
              QUANTIS HOLOGRAPHIC ENCLAVE ACTIVE
            </span>
            <span className="text-[10px] font-quant text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              SOC-2 TYPE II
            </span>
          </div>
          <h1 className="text-2xl font-bold font-quant text-white tracking-tight">
            Welcome, {user?.full_name || "Elena Vance"}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {organization?.name || "Acme Global Treasury"} • Institutional Asset Telemetry & Agentic AI Layer
          </p>
        </div>

        {/* Quick Launch Action Pills */}
        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => onNavigate("/copilot")}
            className="bull-market-btn px-4 py-2.5 rounded-xl text-xs font-quant font-bold transition-all duration-300 flex items-center gap-1.5 hover:scale-105"
          >
            <Bot className="w-4 h-4 text-[#050811]" />
            <span>Launch Copilot</span>
          </button>
          <button
            onClick={() => onNavigate("/workflows")}
            className="hologram-btn px-4 py-2.5 rounded-xl text-xs font-quant font-bold transition-all flex items-center gap-1.5 hover:scale-105"
          >
            <ShieldCheck className="w-4 h-4 text-[#00FFA3]" />
            <span>Audit Contracts</span>
          </button>
        </div>
      </div>

      {/* 3D Holographic Core & Real-time Laser Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive 3D WebGL Hologram */}
        <div className="lg:col-span-5">
          <Interactive3DHologram />
        </div>

        {/* Right: High-Performance Neon Laser Chart */}
        <div className="lg:col-span-7">
          <NeonLaserChart />
        </div>
      </div>

      {/* Interactive Enterprise AI Showcase (Problems Solved, How It Operates, Who It Helps) */}
      <EnterpriseAiShowcase />

      {/* 3D Holographic Treasury Asset Card */}
      <HolographicTreasuryCard />

      {/* Primary KPI Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardWidget
          title="Automated Workflows Run"
          value={metrics?.totalWorkflowsRun ?? "1,482"}
          change="+24 today"
          isPositive={true}
          icon={Layers}
          subtitle="Agentic DAG Executions"
          glowColor="cyan"
        />
        <StatCardWidget
          title="RAG Ingestion Accuracy"
          value="99.8%"
          change="0 Hallucinations"
          isPositive={true}
          icon={Database}
          subtitle="Grounded Vector Indexes"
          glowColor="neon"
        />
        <StatCardWidget
          title="Monthly Labor Reduced"
          value="14,250 hrs"
          change="-64.2% OPEX"
          isPositive={true}
          icon={Clock}
          subtitle="Autonomous Data Entry"
          glowColor="purple"
        />
        <StatCardWidget
          title="Operational Blind Spots"
          value="0 Risks"
          change="48 Mitigated"
          isPositive={true}
          icon={ShieldCheck}
          subtitle="VaR Bound Preserved"
          glowColor="risk"
        />
      </div>

      {/* Bottom Row: Knowledge Ingestion Vault & Live Sovereign Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document Knowledge Ingestion Vault */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel flex flex-col justify-between hover:border-[#00E5FF]/40 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#00E5FF]" />
                  Proprietary Knowledge Vault
                </h3>
                <p className="text-[11px] text-slate-400">
                  Tenant-isolated vector store grounded in pgvector and AES-256 encrypted partitions.
                </p>
              </div>
              <span className="text-[10px] font-quant font-bold px-2.5 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                ACTIVE VECTORS
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: "Acme Sovereign Master Services Agreement (MSA)", type: "Contract", chunks: 142, date: "Today" },
                { name: "Q3 Institutional Treasury Allocations.pdf", type: "Financial", chunks: 98, date: "Yesterday" },
                { name: "Global Vendor Compliance & SOC-2 Audit Matrix", type: "Compliance", chunks: 215, date: "3 days ago" },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between hover:border-[#00E5FF]/40 hover:bg-black/60 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center border border-[#00E5FF]/30">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white truncate max-w-[220px]">{doc.name}</p>
                      <p className="text-[10px] font-quant text-slate-400">
                        {doc.type} • {doc.chunks} semantic vectors • {doc.date}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-quant font-bold px-2 py-0.5 rounded bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/20">
                    INDEXED
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-6 flex items-center justify-between">
            <span className="text-xs font-quant text-slate-400">Total Ingested: 1,840 Vector Chunks</span>
            <button
              onClick={() => onNavigate("/knowledge-base")}
              className="text-xs text-[#00E5FF] hover:text-[#00FFA3] font-quant font-bold flex items-center gap-1 transition-colors"
            >
              Browse Document Vault →
            </button>
          </div>
        </div>

        {/* Right: Live Sovereign Audit Stream */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel flex flex-col justify-between hover:border-[#00FFA3]/40 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#00FFA3]" />
                  Autonomous Audit & Verification Stream
                </h3>
                <p className="text-[11px] text-slate-400">
                  Immutable execution ledger of contractual reviews, risk scoring, and agentic actions.
                </p>
              </div>
              <span className="text-[10px] font-quant font-bold px-2.5 py-0.5 rounded-full bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/30">
                LIVE AUDIT
              </span>
            </div>

            <div className="space-y-2.5">
              {(metrics?.recentExecutions && metrics.recentExecutions.length > 0
                ? metrics.recentExecutions
                : [
                    {
                      id: "1",
                      workflow_name: "Enterprise Contract Risk & Covenant Analyzer",
                      executor_name: "Marcus Reed",
                      execution_time_ms: 1140,
                      status: "completed",
                      created_at: new Date().toISOString(),
                    },
                    {
                      id: "2",
                      workflow_name: "Quarterly Financial Liquidity Synthesizer",
                      executor_name: "Elena Vance",
                      execution_time_ms: 1420,
                      status: "completed",
                      created_at: new Date(Date.now() - 3600000).toISOString(),
                    },
                  ]
              ).map((exec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between hover:border-[#00FFA3]/40 hover:bg-black/60 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00FFA3]/10 text-[#00FFA3] flex items-center justify-center border border-[#00FFA3]/30">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{exec.workflow_name}</p>
                      <p className="text-[10px] font-quant text-slate-400">
                        Executed by {exec.executor_name} • {exec.execution_time_ms ? `${exec.execution_time_ms}ms` : "1.2s"}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-quant font-bold uppercase bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/30">
                    {exec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-6 flex items-center justify-between">
            <span className="text-xs font-quant text-slate-400">Compliance records secured via SHA-256</span>
            <button
              onClick={() => onNavigate("/workflows")}
              className="text-xs text-[#00FFA3] hover:text-[#00E5FF] font-quant font-bold flex items-center gap-1 transition-colors"
            >
              Open Audit Ledger →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
