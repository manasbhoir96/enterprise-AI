import React, { useState } from "react";
import {
  Cpu,
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.js";
import type { RegisterTenantInput } from "@nexusai/shared";

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, register, quickDemoLogin } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register form state
  const [orgName, setOrgName] = useState("");
  const [industry, setIndustry] = useState("Enterprise Cloud & AI Solutions");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login({ email, password });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const payload: RegisterTenantInput = {
        organizationName: orgName,
        industry,
        adminEmail: regEmail,
        adminPassword: regPassword,
        fullName,
      };
      await register(payload);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to provision enterprise tenant.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await quickDemoLogin(demoEmail);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with demo credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-950 flex flex-col justify-center relative overflow-hidden p-4 md:p-8">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Column: Enterprise Hero Banner */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-glow">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Nexus<span className="text-indigo-400">AI</span>
                <span className="text-xs uppercase font-extrabold tracking-widest px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ENTERPRISE
                </span>
              </span>
              <p className="text-xs text-slate-400">The Multi-Tenant Enterprise Knowledge & Workflow Platform</p>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Unify organizational knowledge into an <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">agentic AI brain.</span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Ground your enterprise copilot in verified internal documents with strict Row Level Security (RLS) data isolation and automated compliance workflows powered by Gemini 2.5 Flash.
            </p>
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="glass-panel p-3.5 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Multi-Tenant Hardened
              </div>
              <p className="text-[11px] text-slate-400">Strict organizational boundaries ensuring zero cross-tenant leakage.</p>
            </div>

            <div className="glass-panel p-3.5 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Gemini 2.5 Flash RAG
              </div>
              <p className="text-[11px] text-slate-400">Sub-second synthesis with deterministic OpenAPI JSON schemas.</p>
            </div>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Instant Evaluator 1-Click Demo Logins
              </span>
              <span className="text-[10px] font-mono text-slate-400">Acme Corporation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@acme.com")}
                disabled={isLoading}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-indigo-600/30 text-left border border-white/10 hover:border-indigo-500/40 transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-200">Elena Vance</div>
                <div className="text-[10px] text-indigo-400 flex items-center justify-between mt-0.5">
                  <span>Tenant Owner / Executive</span>
                  <span>→</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("marcus.reed@acme.com")}
                disabled={isLoading}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-cyan-600/30 text-left border border-white/10 hover:border-cyan-500/40 transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-cyan-200">Marcus Reed</div>
                <div className="text-[10px] text-cyan-400 flex items-center justify-between mt-0.5">
                  <span>Admin / Legal & Compliance</span>
                  <span>→</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Auth Card */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative">
            {/* Tabs */}
            <div className="flex items-center rounded-xl bg-nexus-950/60 p-1 mb-6 border border-white/5">
              <button
                type="button"
                onClick={() => { setMode("login"); setError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === "login" ? "bg-indigo-600 text-white shadow-glow" : "text-slate-400 hover:text-white"
                }`}
              >
                Enterprise Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode("register"); setError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === "register" ? "bg-indigo-600 text-white shadow-glow" : "text-slate-400 hover:text-white"
                }`}
              >
                Provision New Tenant
              </button>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {mode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Corporate Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@acme.com"
                      className="glass-input w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Security Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="glass-input w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Authenticating...
                      </>
                    ) : (
                      <>
                        Access Enterprise Workspace
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corp"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Industry Sector
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Financial Services"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Administrator Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@company.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Admin Password (Min 8 chars)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Provisioning Tenant...
                      </>
                    ) : (
                      <>
                        Provision Enterprise Organization
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                SOC2 Type II Compliant
              </span>
              <span>AES-256 GCM Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
