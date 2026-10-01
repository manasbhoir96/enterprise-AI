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
  KeyRound,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.js";

interface EnterpriseSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenApiKeyModal: () => void;
  onOpenShareModal: () => void;
  onOpenSupabaseModal: () => void;
}

export const EnterpriseSidebar: React.FC<EnterpriseSidebarProps> = ({
  currentPath,
  onNavigate,
  onOpenApiKeyModal,
  onOpenShareModal,
  onOpenSupabaseModal,
}) => {
  const { user, organization, logout, customApiKey } = useAuth();

  const navItems = [
    {
      name: "Overview Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      badge: "Stats",
      badgeColor: "text-emerald-300 bg-emerald-500/20 border-emerald-500/40",
    },
    {
      name: "Company AI Copilot",
      path: "/copilot",
      icon: Sparkles,
      badge: "Chat",
      badgeColor: "text-violet-300 bg-violet-500/20 border-violet-500/40",
    },
    {
      name: "Document Library",
      path: "/knowledge-base",
      icon: Database,
      badge: "Docs",
      badgeColor: "text-indigo-300 bg-indigo-500/20 border-indigo-500/40",
    },
    {
      name: "Smart Workflows",
      path: "/workflows",
      icon: Cpu,
      badge: "Audits",
      badgeColor: "text-cyan-300 bg-cyan-500/20 border-cyan-500/40",
    },
    {
      name: "Company Settings & Team",
      path: "/settings/org",
      icon: ShieldCheck,
      badge: "Admin",
      badgeColor: "text-purple-300 bg-purple-500/20 border-purple-500/40",
    },
  ];

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "owner":
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">Tenant Owner</span>;
      case "admin":
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">Org Admin</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-500/10 text-slate-300 border border-slate-500/30">Employee</span>;
    }
  };

  return (
    <aside className="w-64 bg-nexus-900 border-r border-white/5 flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand & Organization Switcher */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-glow">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              Nexus<span className="text-indigo-400">AI</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">B2B</span>
            </h1>
            <p className="text-[11px] text-slate-400">Enterprise AI Copilot</p>
          </div>
        </div>

        {/* Tenant Box */}
        <div className="glass-panel p-2.5 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{organization?.name || "Acme Corporation"}</p>
              <p className="text-[10px] text-slate-400 truncate">{organization?.industry || "Enterprise Cloud"}</p>
            </div>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
            ISOLATED
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Workspaces
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-300"
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    item.badgeColor || "text-slate-400 bg-white/5 border-white/10"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Tools & Public Share */}
        <div className="pt-4 px-1 space-y-2">
          {/* Share App Button */}
          <button
            onClick={onOpenShareModal}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 hover:from-cyan-900/60 hover:to-indigo-900/60 border border-cyan-500/30 text-left transition-all group flex items-center justify-between"
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-cyan-300">Share Public Link</p>
                <p className="text-[10px] text-slate-400">Public HTTPS & Wi-Fi URL</p>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Supabase Integration Button */}
          <button
            onClick={onOpenSupabaseModal}
            className="w-full p-2.5 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-500/20 text-left transition-all group flex items-center justify-between"
          >
            <div className="flex items-center space-x-2.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-white group-hover:text-emerald-300">Supabase Database</p>
                <p className="text-[10px] text-slate-400">Cloud PostgreSQL</p>
              </div>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
              CONNECTED
            </span>
          </button>

          {/* Gemini Engine Banner */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Gemini 2.5 Flash
              </span>
              <button
                onClick={onOpenApiKeyModal}
                className="text-[10px] text-indigo-400 hover:text-indigo-200 underline flex items-center gap-0.5 font-medium"
              >
                <KeyRound className="w-3 h-3" />
                {customApiKey ? "Key Set" : "API Key"}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Fast, intelligent document analysis and RAG answers.
            </p>
          </div>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-white/5 bg-nexus-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0 border border-white/10">
              {user?.full_name ? user.full_name.charAt(0) : "U"}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.full_name || "Enterprise User"}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {getRoleBadge(user?.role)}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out of enterprise workspace"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
