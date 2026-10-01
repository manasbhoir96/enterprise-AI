import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardWidgetProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  subtitle?: string;
  glowColor?: "indigo" | "emerald" | "cyan" | "purple" | "amber" | "gold";
}

export const StatCardWidget: React.FC<StatCardWidgetProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtitle,
}) => {
  return (
    <div className="gold-card-sheen p-5 rounded-2xl bg-white border border-gold-300/60 relative overflow-hidden group hover:border-gold-500 hover:shadow-cardHover transition-all duration-300 shadow-luxuryCard">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold text-gold-900 uppercase tracking-widest mb-1.5 font-serif">
            {title}
          </p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight font-serif-luxury">
            {value}
          </h3>
          {subtitle && <p className="text-[11px] text-slate-500 mt-1">{subtitle}</p>}
        </div>

        <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-gold-300/80 bg-gradient-to-br from-gold-50 to-amber-100/60 text-gold-800 shadow-goldSoft group-hover:scale-105 group-hover:border-gold-500 transition-all duration-300">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {change && (
        <div className="mt-4 pt-3 border-t border-gold-200/50 flex items-center justify-between text-xs">
          <span
            className={`font-bold flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border ${
              isPositive
                ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                : "text-rose-800 bg-rose-50 border-rose-200"
            }`}
          >
            {isPositive ? "↑" : "↓"} {change}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">vs prior fiscal quarter</span>
        </div>
      )}
    </div>
  );
};
