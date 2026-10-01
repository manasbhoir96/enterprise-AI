import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardWidgetProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  subtitle?: string;
  glowColor?: "indigo" | "emerald" | "cyan" | "purple" | "amber";
}

export const StatCardWidget: React.FC<StatCardWidgetProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtitle,
  glowColor = "indigo",
}) => {
  const glowMap = {
    indigo: "border-indigo-500/20 text-indigo-400 group-hover:border-indigo-500/40 bg-indigo-500/10",
    emerald: "border-emerald-500/20 text-emerald-400 group-hover:border-emerald-500/40 bg-emerald-500/10",
    cyan: "border-cyan-500/20 text-cyan-400 group-hover:border-cyan-500/40 bg-cyan-500/10",
    purple: "border-purple-500/20 text-purple-400 group-hover:border-purple-500/40 bg-purple-500/10",
    amber: "border-amber-500/20 text-amber-400 group-hover:border-amber-500/40 bg-amber-500/10",
  };

  return (
    <div className="glass-panel glass-panel-hover p-5 rounded-2xl relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{title}</p>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>}
        </div>

        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${glowMap[glowColor]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {change && (
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
          <span
            className={`font-semibold flex items-center gap-1 ${
              isPositive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isPositive ? "↑" : "↓"} {change}
          </span>
          <span className="text-[11px] text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
};
