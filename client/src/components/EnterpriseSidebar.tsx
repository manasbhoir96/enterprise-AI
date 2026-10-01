import React from "react";
import {
  LayoutDashboard,
  Sparkles,
  Database,
  FileCheck2,
  ShieldCheck,
  LogOut,
  ChevronRight,
  ExternalLink,
  Cpu,
  Layers,
  Activity,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.js";

interface EnterpriseSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenShareModal: () => void;
}

export const EnterpriseSidebar: React.FC<EnterpriseSidebarProps> = ({
  currentPath,
  onNavigate,
  onOpenShareModal,
}) => {
  const { user, organization, logout } = useAuth();

  const navItems = [
    {
      name: "Executive Treasury & Alpha",
      path: "/dashboard",
      icon: LayoutDashboard,
      badge: "Quant",
      badgeColor: "text-[#00FFA3] bg-[#00FFA3]/10 border-[#00FFA3]/40",
    },
    {
      name: "Quantis Reasoning Copilot",
      path: "/copilot",
      icon: Sparkles,
      badge: "RAG AI",
      badgeColor: "text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/40",
    },
    {
      name: "RAG Knowledge Vault",
      path: "/knowledge-base",
      icon: Database,
      badge: "Vector",
      badgeColor: "text-slate-300 bg-white/5 border-white/15",
    },
    {
      name: "Autonomous Workflows & Risk",
      path: "/workflows",
      icon: FileCheck2,
      badge: "Agentic",
      badgeColor: "text-[#C084FC] bg-[#7000FF]/15 border-[#7000FF]/40",
    },
    {
      name: "Institutional Governance",
      path: "/settings/org",
      icon: ShieldCheck,
      badge: "RBAC",
      badgeColor: "text-slate-400 bg-white/5 border-white/10",
    },
  ];

  return (
    <aside className="w-68 bg-[#050811]/95 border-r border-[#00E5FF]/20 flex flex-col h-screen sticky top-0 select-none z-30 shadow-[4px_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      {/* Brand & Organization Header */}
      <div className="p-4 border-b border-[#00E5FF]/15 bg-gradient-to-b from-[#0B0F19] to-[#050811]">
        <div className="flex items-center space-x-3 mb-3">
          {/* Holographic Glowing Logo Core */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FFA3] via-[#00E5FF] to-[#7000FF] p-[1.5px] shadow-[0_0_20px_rgba(0,229,255,0.4)] shrink-0">
            <div className="w-full h-full bg-[#050811] rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#00FFA3] animate-pulse" />
            </div>
          </div>

          <div className="truncate">
            <div className="flex items-center space-x-1.5">
              <h1 className="text-base font-bold font-quant tracking-wide text-white">
                QUANTIS<span className="text-[#00E5FF]">.AI</span>
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-ping" />
            </div>
            <p className="text-[10px] font-quant text-[#00E5FF]/80 uppercase tracking-wider truncate">
              Holographic Enterprise AI
            </p>
          </div>
        </div>

        {/* Multi-Tenant Organization Switcher */}
        <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <div className="w-2 h-2 rounded-full bg-[#00FFA3] shadow-[0_0_8px_#00FFA3]" />
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">
                {organization?.name || "Acme Global Treasury"}
              </p>
              <p className="text-[10px] font-quant text-slate-400">
                {organization?.industry || "Sovereign Asset Fund"} • PARTITION #01
              </p>
            </div>
          </div>
          <span className="text-[9px] font-quant font-bold px-1.5 py-0.5 rounded bg-[#00FFA3]/15 text-[#00FFA3] border border-[#00FFA3]/30">
            LIVE
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-quant font-bold tracking-wider text-slate-400 uppercase">
          OPERATIONAL MATRIX
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? "bg-[#00E5FF]/15 text-white border border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.25)] font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? "text-[#00E5FF]" : "text-slate-400 group-hover:text-[#00FFA3]"
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-quant font-bold px-2 py-0.5 rounded-full border ${
                    item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Tools & Public Share */}
        <div className="pt-4 px-1 space-y-2.5">
          {/* Share App Button */}
          <button
            onClick={onOpenShareModal}
            className="w-full p-3 rounded-xl bg-black/40 border border-[#00FFA3]/30 hover:border-[#00FFA3] transition-all group flex items-center justify-between shadow-[0_0_15px_rgba(0,255,163,0.1)] hover:shadow-[0_0_20px_rgba(0,255,163,0.3)]"
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FFA3] animate-ping" />
              <div>
                <p className="text-xs font-bold font-quant text-white group-hover:text-[#00FFA3] transition-colors">
                  Share Terminal Link
                </p>
                <p className="text-[10px] text-slate-400">Public HTTPS & LAN Gateway</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-[#00FFA3] group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* AI Sovereign Intelligence Banner */}
          <div className="p-3 rounded-xl bg-black/50 border border-white/10">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse" />
                Gemini 2.5 Flash
              </span>
              <span className="text-[9px] font-quant px-2 py-0.5 rounded-full bg-[#7000FF]/25 text-[#C084FC] border border-[#7000FF]/40 font-bold">
                GROUNDED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Real-time enterprise RAG reasoning with cryptographic zero-hallucination perimeter.
            </p>
          </div>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3.5 border-t border-white/10 bg-[#0B0F19]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 truncate">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00FFA3] to-[#00E5FF] flex items-center justify-center text-xs font-black text-[#050811] shrink-0 shadow-[0_0_12px_rgba(0,255,163,0.4)]">
              {user?.full_name ? user.full_name.charAt(0) : "E"}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">
                {user?.full_name || "Elena Vance"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-quant text-[#00E5FF]">
                  Managing Partner (CEO)
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out of Quantis workspace"
            className="p-2 rounded-xl text-slate-400 hover:text-[#FF3366] hover:bg-[#FF3366]/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
