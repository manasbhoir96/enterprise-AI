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
    <div className="perspective-1000">
      <div className="gold-card-sheen p-5 rounded-2xl bg-white border border-gold-300/70 relative overflow-hidden group hover:border-gold-500 hover:shadow-cardHover transition-all duration-300 shadow-luxuryCard preserve-3d hover:-translate-y-1">
        {/* Holographic Security Strip on Top Right Corner */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
          <div className="money-hologram-ribbon absolute transform rotate-45 top-2 -right-6 w-24 py-0.5 text-center shadow-xs">
            <span className="text-[7px] font-mono font-black tracking-widest text-slate-900/90 uppercase block leading-none">
              SECURE
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between relative z-10">
          <div className="translate-z-10">
            <p className="text-[10px] font-bold text-gold-900 uppercase tracking-widest mb-1.5 font-serif">
              {title}
            </p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight font-serif-luxury drop-shadow-xs">
              {value}
            </h3>
            {subtitle && <p className="text-[11px] text-slate-500 mt-1 font-medium">{subtitle}</p>}
          </div>

          <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-gold-300/80 bg-gradient-to-br from-gold-50 to-amber-100/60 text-gold-800 shadow-goldSoft group-hover:scale-110 group-hover:rotate-3 group-hover:border-gold-500 transition-all duration-300 translate-z-20">
            <Icon className="w-5 h-5 drop-shadow-xs" />
          </div>
        </div>

        {change && (
          <div className="mt-4 pt-3 border-t border-gold-200/50 flex items-center justify-between text-xs relative z-10 translate-z-10">
            <span
              className={`font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] border font-mono ${
                isPositive
                  ? "text-emerald-800 bg-emerald-50 border-emerald-300 shadow-2xs"
                  : "text-rose-800 bg-rose-50 border-rose-300 shadow-2xs"
              }`}
            >
              {isPositive ? "↑" : "↓"} {change}
            </span>
            <span className="text-[10px] text-slate-400 font-mono font-medium">Fiscal Run-Rate</span>
          </div>
        )}
      </div>
    </div>
  );
};
