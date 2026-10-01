import React, { useState } from "react";
import {
  Landmark,
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
  Scale,
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
    id: "exec",
    name: "Elena Vance",
    email: "admin@acme.com",
    role: "Managing Partner & CEO",
    department: "Executive Committee",
    badge: "Full Sovereign Authority",
    description: "Full fiduciary oversight across treasury, analytics, and tenant permissions",
  },
  {
    id: "legal",
    name: "Marcus Reed",
    email: "marcus.reed@acme.com",
    role: "General Counsel & VP Risk",
    department: "Legal & Regulatory",
    badge: "Risk & Compliance",
    description: "Audits high-value MSAs, indemnification clauses, and capital covenants",
  },
  {
    id: "hr",
    name: "Sarah Chen",
    email: "sarah.chen@acme.com",
    role: "Managing Director, People",
    department: "Human Capital",
    badge: "Human Capital",
    description: "Oversees global enterprise policies, employee covenants, and compensations",
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
      await login({ email, password });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to authenticate with sovereign vault.");
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
      setError(err.message || "Failed to charter institutional organization.");
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
      setError(err.message || "Failed to sign in with executive credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-center relative overflow-hidden p-4 md:p-8 selection:bg-amber-400/30 selection:text-amber-900">
      {/* Ambient classic marble gold glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-gold-300/15 via-amber-200/10 to-transparent rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-gradient-to-bl from-gold-400/10 to-transparent rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        {/* Left Column: Classic Financial Institution Banner & VIP Persona Selector */}
        <div className="lg:col-span-6 space-y-6">
          {/* Logo & Platform Crest with 3D Coin */}
          <div className="flex items-center space-x-3.5">
            <div className="perspective-800">
              <div className="gold-coin-3d animate-coin-spin shadow-goldGlow cursor-pointer hover:scale-110 transition-transform">
                <div className="gold-coin-rim"></div>
                <div className="relative text-white font-serif-luxury font-black text-2xl drop-shadow-md">
                  $
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900 font-serif-luxury">
                  Nexus<span className="gold-foil-text font-serif">Sovereign</span>
                </span>
                <span className="money-hologram-badge text-[9px] uppercase font-mono font-black tracking-widest px-2.5 py-0.5 rounded-full text-gold-950 border border-gold-400 shadow-2xs">
                  24K MINTED
                </span>
              </div>
              <p className="text-xs text-gold-800 font-medium">Institutional AI Knowledge & Sovereign Wealth Governance</p>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight font-serif-luxury">
              Sovereign control for your enterprise{" "}
              <span className="gold-foil-text font-serif italic">capital, contracts & policies.</span>
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl font-normal">
              Wall Street grade contextual synthesis, automated financial risk covenants, and cryptographic multi-tenant separation.
            </p>
          </div>

          {/* Interactive VIP Demo Personas */}
          <div className="p-5 rounded-3xl bg-white/95 border border-gold-400/40 space-y-3.5 shadow-luxuryCard relative overflow-hidden backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gold-900 flex items-center gap-1.5 uppercase tracking-wider font-serif">
                <Award className="w-4 h-4 text-gold-600" />
                Select Executive Credentials (1-Click Instant Access)
              </span>
              <span className="text-[11px] font-semibold text-slate-500">Acme Sovereign Vault</span>
            </div>

            <p className="text-[11px] text-slate-500">
              Experience the platform through distinct governing roles. Click to populate or login instantly:
            </p>

            <div className="space-y-2.5">
              {DEMO_PERSONAS.map((p) => {
                const isSelected = selectedPersona === p.id && email === p.email;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPersona(p)}
                    className={`gold-card-sheen p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                      isSelected
                        ? "bg-gradient-to-r from-gold-50 via-white to-amber-50/70 border-gold-500 shadow-goldSoft -translate-y-0.5"
                        : "bg-white border-slate-200/90 hover:border-gold-300 hover:bg-gold-50/40 hover:-translate-y-0.5 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center space-x-3.5 truncate">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-amber-700 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-goldSoft border border-gold-300">
                        {p.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate font-serif-luxury">{p.name}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gold-100 text-gold-900 border border-gold-300">
                            {p.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{p.description}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickLogin(p.email);
                      }}
                      disabled={isLoading}
                      className="ml-2.5 px-3.5 py-1.5 rounded-xl text-xs font-bold gold-foil-btn shrink-0 flex items-center gap-1 shadow-xs"
                    >
                      Enter →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pillars of Sovereign Trust */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-white border border-gold-300/40 shadow-xs space-y-1 hover:border-gold-500 transition-colors">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gold-900 font-serif">
                <ShieldCheck className="w-4 h-4 text-gold-600" />
                Capital Safe
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">Cryptographic tenant memory enclaves.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-gold-300/40 shadow-xs space-y-1 hover:border-gold-500 transition-colors">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gold-900 font-serif">
                <Sparkles className="w-4 h-4 text-gold-600" />
                Gemini 3.8 Flash
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">Private intelligence with legal citations.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-gold-300/40 shadow-xs space-y-1 hover:border-gold-500 transition-colors">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gold-900 font-serif">
                <Scale className="w-4 h-4 text-gold-600" />
                Audit Trail
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">Immutable audit log for compliance.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Pristine Luxury Auth Vault Card with 3D Hologram */}
        <div className="lg:col-span-6 perspective-1000">
          <div className="p-8 rounded-3xl bg-white border-2 border-gold-400/60 shadow-2xl relative backdrop-blur-2xl preserve-3d banknote-guilloche hologram-scanline overflow-hidden">
            {/* Top Edge Banknote Hologram Foil Strip */}
            <div className="money-hologram-ribbon -mx-8 -mt-8 mb-6 py-1.5 px-6 flex items-center justify-between text-[9px] font-mono font-black text-slate-900 tracking-wider shadow-inner">
              <span>★ SOVEREIGN ENCLAVE AUTHENTICATOR</span>
              <span>100% HARDWARE ENCRYPTED ★</span>
            </div>

            {/* Animated Tab Switcher */}
            <div className="flex items-center rounded-2xl bg-[#F8F9FA] p-1.5 mb-6 border border-gold-300/50 relative z-10 translate-z-10">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  mode === "login"
                    ? "gold-foil-btn shadow-goldSoft"
                    : "text-slate-600 hover:text-slate-950 font-medium"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                Sovereign Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  mode === "register"
                    ? "gold-foil-btn shadow-goldSoft"
                    : "text-slate-600 hover:text-slate-950 font-medium"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Charter Organization
              </button>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                <span>{error}</span>
              </div>
            )}

            {mode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-serif">
                    Corporate Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gold-600 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@acme.com"
                      className="glass-input w-full pl-10 pr-3.5 py-3 rounded-2xl text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-serif">
                      Security Password
                    </label>
                    <span className="text-[11px] font-medium text-gold-800">Default: password123</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gold-600 absolute left-3.5 top-3.5 pointer-events-none" />
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
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-gold-700 transition-colors"
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
                    className="w-full py-3.5 rounded-2xl gold-foil-btn font-extrabold text-xs shadow-goldGlow transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Authenticating Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span className="font-serif">Access Sovereign Vault</span>
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
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 font-serif">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Sovereign Capital"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 font-serif">
                      Industry Sector
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sovereign Wealth"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 font-serif">
                    Managing Partner Name
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 font-serif">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="partner@sovereigncapital.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 font-serif">
                    Master Password (Min 8 chars)
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
                    className="w-full py-3.5 rounded-2xl gold-foil-btn font-extrabold text-xs shadow-goldGlow transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Chartering Enterprise...</span>
                      </>
                    ) : (
                      <>
                        <span className="font-serif">Charter Sovereign Organization</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-gold-300/40 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Fiduciary Tenant Isolation
              </span>
              <span className="font-mono text-[10px] text-gold-900">ENCRYPTION: AES-256 GCM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
