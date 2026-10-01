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
  Eye,
  EyeOff,
  Briefcase,
  FileCheck2,
  Users,
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
  avatarColor: string;
  accentBorder: string;
  description: string;
}

const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "exec",
    name: "Elena Vance",
    email: "admin@acme.com",
    role: "CEO & Executive",
    department: "Executive Leadership",
    avatarColor: "from-violet-500 via-indigo-500 to-cyan-400",
    accentBorder: "hover:border-violet-400 focus:border-violet-400",
    description: "Full executive access to all company telemetry and metrics",
  },
  {
    id: "legal",
    name: "Marcus Reed",
    email: "marcus.reed@acme.com",
    role: "VP of Legal",
    department: "Legal & Compliance",
    avatarColor: "from-cyan-500 to-blue-600",
    accentBorder: "hover:border-cyan-400 focus:border-cyan-400",
    description: "Reviews contracts, MSAs, and compliance audit workflows",
  },
  {
    id: "hr",
    name: "Sarah Chen",
    email: "sarah.chen@acme.com",
    role: "Director of HR",
    department: "Human Resources",
    avatarColor: "from-emerald-400 to-teal-600",
    accentBorder: "hover:border-emerald-400 focus:border-emerald-400",
    description: "Answers company policy, benefits, and handbook questions",
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
  const [industry, setIndustry] = useState("Enterprise Cloud & AI Solutions");
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
      await login({ email, password });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
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
      setError(err.message || "Failed to create organization.");
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
      setError(err.message || "Failed to sign in with demo profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-950 flex flex-col justify-center relative overflow-hidden p-4 md:p-8 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Dynamic ambient fluid background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/15 to-transparent rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-600/15 to-transparent rounded-full blur-[110px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        {/* Left Column: Friendly Hero Intro & 1-Click Persona Chooser */}
        <div className="lg:col-span-6 space-y-6">
          {/* Logo & Platform Badge */}
          <div className="flex items-center space-x-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950/40 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
                <Cpu className="w-6 h-6 text-cyan-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white">
                  Nexus<span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">Smart AI Copilot for Your Company Documents</p>
            </div>
          </div>

          {/* Value Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              One smart assistant for your company's{" "}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                policies, contracts & docs.
              </span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Instant answers backed by direct document citations, automated contract risk audits, and strict multi-tenant privacy.
            </p>
          </div>

          {/* Interactive 1-Click Demo Profiles */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-indigo-500/30 space-y-3.5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-500/10 via-cyan-500/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                Quick Demo: Choose a Profile (1-Click Login)
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Pre-seeded Acme Corp</span>
            </div>

            <p className="text-[11px] text-slate-400">
              Click any team member profile to test different roles and access controls instantly:
            </p>

            <div className="space-y-2">
              {DEMO_PERSONAS.map((p) => {
                const isSelected = selectedPersona === p.id && email === p.email;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPersona(p)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? "bg-indigo-950/60 border-indigo-400/80 shadow-lg shadow-indigo-500/15"
                        : "bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${p.avatarColor} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md`}
                      >
                        {p.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">{p.name}</span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                            {p.role}
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
                      className="ml-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 transition-all flex items-center gap-1 shadow-sm"
                    >
                      Login →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                100% Private
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Multi-tenant isolation per organization.</p>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Gemini 3.8 AI
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Instant answers with document citations.</p>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                Contract Audits
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Automated risk checks and compliance rules.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Fluid Auth Card */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative backdrop-blur-2xl">
            {/* Animated Tab Switcher */}
            <div className="flex items-center rounded-2xl bg-nexus-950/70 p-1.5 mb-6 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                  mode === "login"
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                  mode === "register"
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Create Organization
              </button>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                <span>{error}</span>
              </div>
            )}

            {mode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@acme.com"
                      className="glass-input w-full pl-10 pr-3.5 py-3 rounded-2xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-400">Demo: password123</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="glass-input w-full pl-10 pr-10 py-3 rounded-2xl text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Entering Workspace...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to NexusAI</span>
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
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corp"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Industry Sector
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Enterprise Cloud"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@yourcompany.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Password (Min 8 chars)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Setting Up Workspace...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Enterprise Workspace</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Private Tenant Isolation
              </span>
              <span>AES-256 Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
