import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardWidgetProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  subtitle?: string;
  glowColor?: "cyan" | "neon" | "purple" | "risk";
}

export const StatCardWidget: React.FC<StatCardWidgetProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtitle,
  glowColor = "cyan",
}) => {
  return (
    <div className="perspective-1000">
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-[#00E5FF]/50 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] transition-all duration-300 preserve-3d hover:-translate-y-1">
        {/* Holographic Security Strip on Top Right Corner */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
          <div className="money-hologram-ribbon absolute transform rotate-45 top-2 -right-6 w-24 py-0.5 text-center shadow-xs">
            <span className="text-[7px] font-quant font-black tracking-widest text-[#050811] uppercase block leading-none">
              QUANTIS
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between relative z-10">
          <div className="translate-z-10">
            <p className="text-[10px] font-quant font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              {title}
            </p>
            <h3 className="text-2xl font-bold font-quant text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
              {value}
            </h3>
            {subtitle && <p className="text-[11px] text-slate-400 mt-1 font-medium">{subtitle}</p>}
          </div>

          <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-[#00E5FF]/30 bg-black/40 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)] group-hover:scale-110 group-hover:rotate-3 group-hover:border-[#00FFA3] group-hover:text-[#00FFA3] group-hover:shadow-[0_0_20px_rgba(0,255,163,0.35)] transition-all duration-300 translate-z-20">
            <Icon className="w-5 h-5 drop-shadow-xs" />
          </div>
        </div>

        {change && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs relative z-10 translate-z-10">
            <span
              className={`font-quant font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] border ${
                isPositive
                  ? "text-[#00FFA3] bg-[#00FFA3]/10 border-[#00FFA3]/30 shadow-[0_0_8px_rgba(0,255,163,0.2)]"
                  : "text-[#FF3366] bg-[#FF3366]/10 border-[#FF3366]/30 shadow-[0_0_8px_rgba(255,51,102,0.2)]"
              }`}
            >
              {isPositive ? "↑" : "↓"} {change}
            </span>
            <span className="text-[10px] text-slate-400 font-quant font-medium">Real-time Telemetry</span>
          </div>
        )}
      </div>
    </div>
  );
};
