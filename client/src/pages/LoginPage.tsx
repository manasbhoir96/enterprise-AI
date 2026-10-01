import React, { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Eye,
  EyeOff,
  Briefcase,
  FileCheck2,
  Award,
  TrendingUp,
  Cpu,
  Layers,
  Database,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.js";
import type { RegisterTenantInput } from "@nexusai/shared";

interface LoginPageProps {
  onSuccess: () => void;
}

interface DemoPersona {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  badge: string;
  description: string;
}

const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "acem",
    name: "Manas Bhoir",
    email: "manasbhoir96@gmail.com",
    role: "Managing Partner & CEO",
    department: "ACEM CORP Executive",
    badge: "ACEM Partition Owner",
    description: "Full sovereign governance over ACEM Corp enterprise partition, AI Copilot, and knowledge assets",
  },
  {
    id: "exec",
    name: "Elena Vance",
    email: "admin@acme.com",
    role: "Managing Partner & CEO",
    department: "Executive Committee",
    badge: "Full Sovereign Authority",
    description: "Fiduciary oversight across institutional treasury, RAG analytics, and enterprise permissions",
  },
  {
    id: "legal",
    name: "Marcus Reed",
    email: "marcus.reed@acme.com",
    role: "General Counsel & VP Risk",
    department: "Legal & Regulatory",
    badge: "Risk & Compliance",
    description: "Audits high-value MSAs, indemnification liabilities, and debt covenants",
  },
  {
    id: "hr",
    name: "Sarah Chen",
    email: "sarah.chen@acme.com",
    role: "Managing Director, People",
    department: "Human Capital",
    badge: "Human Capital",
    description: "Oversees global enterprise policies, employee handbooks, and compensations",
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, register, quickDemoLogin } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  // Form states
  const [email, setEmail] = useState("admin@acme.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<string>("exec");

  // Register form state
  const [orgName, setOrgName] = useState("");
  const [industry, setIndustry] = useState("Institutional Wealth & Private Equity");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPersona = (p: DemoPersona) => {
    setSelectedPersona(p.id);
    setEmail(p.email);
    setPassword("password123");
    setError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (regPassword.length < 8) {
      setError("Master Password must be at least 8 characters long.");
      return;
    }
    setIsLoading(true);
    try {
      const payload: RegisterTenantInput = {
        organizationName: orgName.trim(),
        industry,
        adminEmail: regEmail.trim(),
        adminPassword: regPassword,
        fullName: fullName.trim(),
      };
      await register(payload);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await quickDemoLogin(userEmail);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Quick demo login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-gold-500/30 selection:text-white relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10 px-4">
        <div className="glass-panel rounded-3xl border border-gold-500/30 p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.85)] relative overflow-hidden">
          {/* Holographic Security Ribbon across top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 money-hologram-ribbon" />

          {/* Header Branding */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#FFF] to-[#C5A059] p-[1.5px] shadow-[0_0_25px_rgba(212,175,55,0.4)]">
              <div className="w-full h-full bg-[#050811] rounded-[14px] flex items-center justify-center">
                <Cpu className="w-8 h-8 text-[#D4AF37] animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                <span className="text-[11px] font-quant font-bold text-[#D4AF37] uppercase tracking-widest">
                  ENTERPRISE OPERATIONAL LAYER
                </span>
              </div>
              <h1 className="text-3xl font-bold font-quant text-white tracking-tight mt-1">
                QUANTIS<span className="text-[#D4AF37]">.AI</span>
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                Holographic Enterprise Intelligence, Grounded RAG & Autonomous Agentic Workflows
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-black/60 border border-gold-500/20 mt-2">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-quant font-bold transition-all ${
                  mode === "login"
                    ? "gold-foil-btn text-white shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-quant font-bold transition-all ${
                  mode === "register"
                    ? "gold-foil-btn text-white shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Create Enterprise Tenant
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#FF3366]/10 border border-[#FF3366]/40 text-[#FF3366] text-xs font-quant flex flex-wrap items-center justify-between gap-2 shadow-[0_0_15px_rgba(255,51,102,0.15)]">
              <div className="flex items-center gap-2">
                <span className="font-bold">Notice:</span> {error}
              </div>
              {(error.toLowerCase().includes("already exists") || error.toLowerCase().includes("registered")) && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setEmail(regEmail || email || "manasbhoir96@gmail.com");
                    setPassword("password123");
                    setError(null);
                  }}
                  className="px-3.5 py-1.5 rounded-lg gold-foil-btn text-white font-bold text-xs transition-all shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                >
                  Switch to Sign In with this Email →
                </button>
              )}
            </div>
          )}

          {/* 1-Click VIP Persona Selector (Login Mode) */}
          {mode === "login" && (
            <div className="mb-8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-quant font-bold uppercase tracking-wider text-slate-300">
                  ⚡ 1-Click Executive Personas:
                </span>
                <span className="text-[10px] font-quant text-[#D4AF37] font-bold">Instant VIP Access</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {DEMO_PERSONAS.map((p) => {
                  const isSelected = selectedPersona === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPersona(p)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? "bg-black/60 border-gold-500/60 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                          : "bg-black/40 border-gold-500/20 hover:border-gold-500/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#C5A059] flex items-center justify-center text-[#050811] font-bold text-xs font-quant shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                          {p.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-quant text-white truncate">{p.name}</span>
                            <span className="text-[10px] font-quant font-semibold px-2 py-0.5 rounded bg-gold-500/15 text-[#D4AF37] border border-gold-500/30">
                              {p.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{p.description}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickLogin(p.email);
                        }}
                        disabled={isLoading}
                        className="ml-2.5 px-3 py-1.5 rounded-xl text-xs font-quant font-bold gold-foil-btn shrink-0 flex items-center gap-1"
                      >
                        Enter →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form */}
          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-quant font-semibold text-slate-300 mb-1.5">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-quant text-white"
                    placeholder="officer@acme.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-quant font-semibold text-slate-300 mb-1.5">
                  Secure Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full pl-10 pr-10 py-2.5 rounded-xl text-xs font-quant text-white"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full gold-foil-btn py-3 rounded-xl text-xs font-quant font-bold flex items-center justify-center gap-2 mt-2 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                <span>{isLoading ? "Authenticating Sovereign Session..." : "Sign In to Quantis Terminal"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-quant font-semibold text-slate-300 mb-1">
                  Enterprise Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Acme Global Sovereign Capital"
                  className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-quant text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-quant font-semibold text-slate-300 mb-1">
                  Primary Operating Sector
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-quant text-white cursor-pointer"
                >
                  <option value="Institutional Wealth & Private Equity" className="bg-[#0B0F19]">
                    Institutional Wealth & Private Equity
                  </option>
                  <option value="Quantitative Hedge Fund" className="bg-[#0B0F19]">Quantitative Hedge Fund</option>
                  <option value="Global Supply Chain & Logistics" className="bg-[#0B0F19]">Global Supply Chain & Logistics</option>
                  <option value="Enterprise SaaS & Technology" className="bg-[#0B0F19]">Enterprise SaaS & Technology</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-quant font-semibold text-slate-300 mb-1">
                    Officer Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Elena Vance"
                    className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-quant text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-quant font-semibold text-slate-300 mb-1">
                    Officer Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="elena@acme.com"
                    className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-quant text-white"
                  />
                  {regEmail.toLowerCase().trim() === "manasbhoir96@gmail.com" && (
                    <div className="mt-2 p-2.5 rounded-lg bg-gold-500/15 border border-gold-500/40 text-[11px] font-quant text-amber-200 flex items-center justify-between gap-1.5">
                      <span>⚡ Account exists for <strong>ACEM CORP</strong>!</span>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setEmail("manasbhoir96@gmail.com");
                          setPassword("password123");
                          setError(null);
                        }}
                        className="px-2 py-0.5 rounded bg-[#D4AF37] text-black font-bold text-[10px] hover:bg-[#E5C158] transition-all cursor-pointer"
                      >
                        Sign In Now →
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-quant font-semibold text-slate-300">
                    Master Password
                  </label>
                  <span className={`text-[10px] font-quant ${regPassword.length >= 8 ? "text-[#00FFA3]" : "text-slate-400"}`}>
                    {regPassword.length >= 8 ? "✓ Min 8 chars met" : "Min 8 characters required"}
                  </span>
                </div>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-quant text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full gold-foil-btn py-3 rounded-xl text-xs font-quant font-bold flex items-center justify-center gap-2 mt-2 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                <span>{isLoading ? "Provisioning Isolated Tenant..." : "Initialize Quantis Partition"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Pillars of Enterprise AI */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gold-500/20 mt-6 text-center">
            <div className="p-3 rounded-xl bg-black/40 border border-gold-500/15 space-y-1">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] mx-auto" />
              <p className="text-[11px] font-quant font-bold text-white">Grounded RAG</p>
              <p className="text-[9px] text-slate-400">Zero data leakage</p>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-gold-500/15 space-y-1">
              <Cpu className="w-4 h-4 text-[#D4AF37] mx-auto" />
              <p className="text-[11px] font-quant font-bold text-white">Agentic DAG</p>
              <p className="text-[9px] text-slate-400">Human-in-the-loop</p>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-gold-500/15 space-y-1">
              <Layers className="w-4 h-4 text-[#D4AF37] mx-auto" />
              <p className="text-[11px] font-quant font-bold text-white">ERP Embedded</p>
              <p className="text-[9px] text-slate-400">SOC-2 Type II</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
