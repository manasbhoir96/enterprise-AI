import React from "react";
import {
  LayoutDashboard,
  Sparkles,
  FolderGit2,
  Cpu,
  Settings,
  ShieldCheck,
  Building2,
  LogOut,
  ChevronRight,
  Database,
  ExternalLink,
  Landmark,
  Coins,
  FileCheck2,
  Award,
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
      name: "Executive Treasury & Stats",
      path: "/dashboard",
      icon: LayoutDashboard,
      badge: "Capital",
      badgeColor: "text-amber-800 bg-amber-100/70 border-amber-300",
    },
    {
      name: "Institutional Copilot",
      path: "/copilot",
      icon: Sparkles,
      badge: "Advisor",
      badgeColor: "text-gold-800 bg-gold-100/70 border-gold-300",
    },
    {
      name: "Document Vault & MSAs",
      path: "/knowledge-base",
      icon: Database,
      badge: "Vault",
      badgeColor: "text-slate-800 bg-slate-100 border-slate-300",
    },
    {
      name: "Audit & Risk Engine",
      path: "/workflows",
      icon: FileCheck2,
      badge: "Compliance",
      badgeColor: "text-emerald-800 bg-emerald-100/80 border-emerald-300",
    },
    {
      name: "Sovereign Governance & Team",
      path: "/settings/org",
      icon: ShieldCheck,
      badge: "Director",
      badgeColor: "text-indigo-800 bg-indigo-100/70 border-indigo-300",
    },
  ];

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "owner":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gold-100 text-gold-900 border border-gold-300 flex items-center gap-1 shadow-xs">
            <Award className="w-2.5 h-2.5 text-gold-600" />
            Managing Partner
          </span>
        );
      case "admin":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-800 border border-slate-300 shadow-xs">
            Senior Director
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-50 text-slate-600 border border-slate-200">
            Associate
          </span>
        );
    }
  };

  return (
    <aside className="w-68 bg-white border-r border-gold-500/20 flex flex-col h-screen sticky top-0 select-none z-30 shadow-[4px_0_24px_-4px_rgba(197,160,89,0.08)]">
      {/* Brand & Organization Switcher */}
      <div className="p-4 border-b border-gold-500/15 bg-gradient-to-b from-gold-50/50 to-white">
        <div className="flex items-center space-x-3 mb-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gold-600 via-gold-500 to-amber-600 flex items-center justify-center shadow-goldSoft border border-gold-400/50 transition-transform duration-300 hover:scale-105">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5 font-serif-luxury">
              Nexus<span className="gold-foil-text font-serif">Sovereign</span>
            </h1>
            <p className="text-[11px] text-gold-800 font-medium">Private Institutional Intelligence</p>
          </div>
        </div>

        {/* Tenant Box - Luxury Private Wealth Style */}
        <div className="p-2.5 rounded-xl border border-gold-400/30 bg-gradient-to-r from-gold-50/80 via-white to-gold-50/40 flex items-center justify-between shadow-xs transition-all duration-200 hover:border-gold-500/60">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gold-100 flex items-center justify-center shrink-0 border border-gold-300/60">
              <Building2 className="w-4 h-4 text-gold-800" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate font-serif-luxury">
                {organization?.name || "Acme Sovereign Capital"}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {organization?.industry || "Institutional Wealth & AI"}
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-gold-200/50 text-gold-900 border border-gold-300/80 font-bold">
            TIER 1
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-serif">
          Executive Chambers
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs transition-all duration-200 group relative ${
                isActive
                  ? "bg-gradient-to-r from-gold-100/90 to-amber-50/70 text-slate-950 font-bold border border-gold-400/50 shadow-sm"
                  : "text-slate-600 hover:text-slate-950 hover:bg-gold-50/60 hover:border hover:border-gold-200/80"
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon
                  className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-gold-700" : "text-slate-400 group-hover:text-gold-600"
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-xs ${
                    item.badgeColor || "text-slate-700 bg-slate-100 border-slate-300"
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
            className="w-full p-3 rounded-2xl bg-gradient-to-br from-gold-50 via-white to-amber-50/60 border border-gold-400/40 text-left transition-all duration-300 hover:shadow-cardHover hover:border-gold-500 group flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-ping"></span>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-gold-800 font-serif-luxury">
                  Share Public Link
                </p>
                <p className="text-[10px] text-slate-500">Secured HTTPS & Wi-Fi Gateway</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gold-600 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* AI Sovereign Intelligence Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-gold-50/70 via-white to-slate-50 border border-gold-300/40 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-serif-luxury">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Gemini 3.8 Flash
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-gold-200/60 text-gold-900 border border-gold-400/60 font-bold">
                AUDITED
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Institutional intelligence and automated risk auditing engine.
            </p>
          </div>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3.5 border-t border-gold-500/20 bg-gradient-to-b from-white to-gold-50/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 truncate">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-600 via-gold-500 to-amber-700 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-goldSoft border border-gold-300">
              {user?.full_name ? user.full_name.charAt(0) : "E"}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate font-serif-luxury">
                {user?.full_name || "Elena Vance"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {getRoleBadge(user?.role)}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out of sovereign workspace"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
