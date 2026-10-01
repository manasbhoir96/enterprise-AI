import React, { useState } from "react";
import {
  Brain,
  Layers,
  Database,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  HeartHandshake,
  AlertTriangle,
  Building,
  Users,
  Briefcase,
  ChevronRight,
  Sparkles,
  Cpu,
  Target,
  FileCheck2,
} from "lucide-react";

export const EnterpriseAiShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"problems" | "architecture" | "stakeholders">("problems");
  const [selectedItem, setSelectedItem] = useState<number>(0);

  const problems = [
    {
      title: "Information Overload",
      subtitle: "Unlocking Dark Data & Hidden Corporate Trends",
      icon: Database,
      stat: "10,000x Faster",
      statLabel: "Query Resolution",
      color: "cyan",
      borderColor: "border-[#00E5FF]/40",
      glowColor: "rgba(0,229,255,0.2)",
      badgeColor: "text-[#00E5FF] bg-[#00E5FF]/10",
      description:
        "Instantly synthesizes millions of unorganized documents, financial reports, and ERP logs. Surfaces hidden correlations and proprietary patterns that human analysts miss.",
      metrics: [
        { label: "Semantic Ingestion", value: "480k docs/min" },
        { label: "Hallucination Rate", value: "< 0.01%" },
      ],
    },
    {
      title: "Repetitive Manual Labor",
      subtitle: "Eliminating Routine Drudgery & Compliance Sludge",
      icon: Clock,
      stat: "14,250 Hrs",
      statLabel: "Monthly Labor Saved",
      color: "neon",
      borderColor: "border-[#00FFA3]/40",
      glowColor: "rgba(0,255,163,0.2)",
      badgeColor: "text-[#00FFA3] bg-[#00FFA3]/10",
      description:
        "Frees operations, accounting, and compliance teams from manual invoice tagging, SOC-2 audits, and routine reconciliation. Teams redirect energy to high-alpha strategy.",
      metrics: [
        { label: "OPEX Reduction", value: "-64.2%" },
        { label: "Audit Accuracy", value: "99.98%" },
      ],
    },
    {
      title: "Inconsistent Customer Experiences",
      subtitle: "Omnichannel 24/7 Predictive Customer Copilots",
      icon: HeartHandshake,
      stat: "98.4%",
      statLabel: "CSAT Satisfaction",
      color: "purple",
      borderColor: "border-[#7000FF]/40",
      glowColor: "rgba(112,0,255,0.2)",
      badgeColor: "text-[#C084FC] bg-[#7000FF]/15",
      description:
        "Anticipates enterprise client needs with contextual memory. Delivers personalized contract summaries, billing insights, and 24/7 proactive issue resolution.",
      metrics: [
        { label: "First-Contact Resolution", value: "94.6%" },
        { label: "Response Latency", value: "180ms" },
      ],
    },
    {
      title: "Operational Blind Spots",
      subtitle: "Autonomous Financial & Supply Chain Risk Shield",
      icon: AlertTriangle,
      stat: "48 Risks",
      statLabel: "Mitigated Proactively",
      color: "risk",
      borderColor: "border-[#FF3366]/40",
      glowColor: "rgba(255,51,102,0.2)",
      badgeColor: "text-[#FF3366] bg-[#FF3366]/10",
      description:
        "Detects liquidity crunches, supplier lead-time bottlenecks, and contract covenant breaches days before they materialize into costly corporate write-downs.",
      metrics: [
        { label: "VaR Bound Preserved", value: "$410k Limit" },
        { label: "Breach Warning Lead", value: "72 Hours" },
      ],
    },
  ];

  const architecture = [
    {
      title: "Retrieval-Augmented Generation (RAG)",
      subtitle: "Cryptographically Grounded Internal Context",
      icon: ShieldCheck,
      color: "cyan",
      badge: "Zero Data Leakage",
      description:
        "AI models are strictly bounded by your proprietary vector indexes and permissions. Answers link directly to immutable source documents with exact line-level audit trails.",
      capabilities: [
        "Hybrid Dense + BM25 Sparse Vector Search",
        "Tenant-isolated pgvector / Supabase partitions",
        "Deterministic ground-truth citation chips",
      ],
    },
    {
      title: "Agentic Workflows & Multi-Step Reasoning",
      subtitle: "From Chatbots to Autonomous Enterprise Operators",
      icon: Cpu,
      color: "neon",
      badge: "Human-in-the-Loop",
      description:
        "Agents do not merely converse; they reason across workflows, invoke backend microservices, trigger payment runs, and request executive sign-off when confidence thresholds dictate.",
      capabilities: [
        "DAG Workflow Orchestration & Conditional Branching",
        "Autonomous API Execution & State Machines",
        "Cryptographic approval signing for board officers",
      ],
    },
    {
      title: "Embedded ERP/CRM Integration",
      subtitle: "Native Operation Inside Core Infrastructure",
      icon: Layers,
      color: "purple",
      badge: "Real-time Webhooks",
      description:
        "Connects bidirectionally to SAP, Salesforce, NetSuite, and Snowflake. No clunky external portals—AI intelligence is injected directly into daily operational pipelines.",
      capabilities: [
        "Bi-directional REST & GraphQL webhooks",
        "Zero-ETL real-time streaming schema sync",
        "SOC-2 Type II & GDPR compliant perimeter",
      ],
    },
  ];

  const stakeholders = [
    {
      role: "Business Leaders & C-Suite",
      focus: "High-Alpha Strategy & Capital Allocation",
      icon: Building,
      color: "neon",
      impact: "+32% Strategic Agility",
      points: [
        "Real-time Monte Carlo revenue forecasts and liquidity stress-testing",
        "Executive board briefing decks generated autonomously in seconds",
        "Instant competitive intelligence and market trend radar",
      ],
    },
    {
      role: "Internal Operating Departments",
      focus: "Autonomous Task Execution Across Silos",
      icon: Users,
      color: "cyan",
      impact: "64% Faster Turnaround",
      points: [
        "HR: Automated talent candidate sourcing and policy lookup",
        "Finance: Real-time fraud detection and automatic invoice ledger reconciliation",
        "Legal & Compliance: Instant contract covenant risk analysis and redlining",
      ],
    },
    {
      role: "Enterprise Clients & Partners",
      focus: "Frictionless Omnichannel Velocity",
      icon: Briefcase,
      color: "purple",
      impact: "99.2% Uptime SLA",
      points: [
        "Sub-second AI resolution for high-value enterprise support tickets",
        "Customized portfolio reports delivered on demand",
        "Proactive account management and automated contract renewals",
      ],
    },
  ];

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border border-[#00E5FF]/20 shadow-[0_0_35px_rgba(0,0,0,0.7)] relative overflow-hidden">
      {/* Background glow highlights */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#7000FF]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Enterprise AI badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-quant font-bold text-[#00FFA3] bg-[#00FFA3]/10 border border-[#00FFA3]/30">
              OPERATIONAL LAYER
            </span>
            <span className="text-xs text-slate-400 font-quant">STRATEGIC ENTERPRISE AI</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1.5 flex items-center space-x-2">
            <span>What is Enterprise AI?</span>
            <span className="text-[#00E5FF] text-sm font-normal hidden sm:inline">
              — The Autonomous Operational Backbone
            </span>
          </h2>
          <p className="text-sm text-slate-400 max-w-3xl mt-1">
            The strategic integration of generative AI, predictive machine learning, and agentic workflows directly into
            core systems to eliminate manual bottlenecks, secure institutional memory, and automate revenue operations.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/10 self-start md:self-center">
          <button
            onClick={() => {
              setActiveTab("problems");
              setSelectedItem(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "problems"
                ? "bg-[#00FFA3] text-[#050811] shadow-[0_0_15px_rgba(0,255,163,0.4)] font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Problems Solved
          </button>
          <button
            onClick={() => {
              setActiveTab("architecture");
              setSelectedItem(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "architecture"
                ? "bg-[#00E5FF] text-[#050811] shadow-[0_0_15px_rgba(0,229,255,0.4)] font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            How It Operates
          </button>
          <button
            onClick={() => {
              setActiveTab("stakeholders");
              setSelectedItem(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "stakeholders"
                ? "bg-[#7000FF] text-white shadow-[0_0_15px_rgba(112,0,255,0.4)] font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Who It Helps
          </button>
        </div>
      </div>

      {/* Content Panels */}
      <div className="mt-6">
        {/* TAB 1: PROBLEMS SOLVED */}
        {activeTab === "problems" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {problems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedItem(idx)}
                  style={{
                    boxShadow: selectedItem === idx ? `0 0 24px ${item.glowColor}` : undefined,
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group bg-black/40 hover:bg-black/60 relative ${
                    selectedItem === idx
                      ? `${item.borderColor} ring-1 ring-white/20`
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${item.badgeColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-quant text-xs font-bold text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {item.stat}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-[#00E5FF] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mb-3">{item.subtitle}</p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.description}</p>

                  <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-center">
                    {item.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="bg-black/30 p-1.5 rounded border border-white/5">
                        <span className="block text-[10px] font-quant text-slate-400">{m.label}</span>
                        <span className="block text-xs font-quant font-bold text-slate-200">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: ARCHITECTURE (HOW IT WORKS) */}
        {activeTab === "architecture" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {architecture.map((arch, idx) => {
              const Icon = arch.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-white/10 bg-black/40 hover:border-[#00E5FF]/40 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-quant font-semibold text-[#00FFA3] bg-[#00FFA3]/10 px-2.5 py-0.5 rounded-full border border-[#00FFA3]/20">
                        {arch.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">{arch.title}</h3>
                    <p className="text-xs text-[#00E5FF] font-medium mb-3">{arch.subtitle}</p>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{arch.description}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/10">
                    {arch.capabilities.map((cap, cIdx) => (
                      <div key={cIdx} className="flex items-center space-x-2 text-xs text-slate-300">
                        <Sparkles className="w-3 h-3 text-[#00FFA3] shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: STAKEHOLDERS (WHO IT HELPS) */}
        {activeTab === "stakeholders" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {stakeholders.map((sh, idx) => {
              const Icon = sh.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-white/10 bg-black/40 hover:border-[#7000FF]/50 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-lg bg-[#7000FF]/15 text-[#C084FC] border border-[#7000FF]/30">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-quant font-bold text-[#00FFA3] bg-[#00FFA3]/10 px-2 py-0.5 rounded border border-[#00FFA3]/30">
                        {sh.impact}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">{sh.role}</h3>
                    <p className="text-xs text-slate-400 font-medium mb-4">{sh.focus}</p>

                    <div className="space-y-2.5">
                      {sh.points.map((p, pIdx) => (
                        <div key={pIdx} className="flex items-start space-x-2 text-xs text-slate-300">
                          <ChevronRight className="w-3.5 h-3.5 text-[#00E5FF] shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
