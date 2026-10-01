import React from "react";
import { TrendingUp, ShieldCheck, Activity, Cpu, Sparkles, AlertTriangle, Zap } from "lucide-react";

interface TickerItem {
  id: string;
  symbol: string;
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  isWarning?: boolean;
  type: "quant" | "enterprise" | "market";
}

const TICKER_DATA: TickerItem[] = [
  { id: "1", symbol: "QUANTIS-ALPHA", label: "Alpha Score", value: "3.48", change: "+18.4%", isPositive: true, type: "quant" },
  { id: "2", symbol: "RAG-GROUNDING", label: "Enterprise Recall", value: "99.8%", change: "SOC-2 Ready", isPositive: true, type: "enterprise" },
  { id: "3", symbol: "AGENTIC-NODES", label: "Autonomous Steps", value: "1,482", change: "+24 today", isPositive: true, type: "enterprise" },
  { id: "4", symbol: "BLIND-SPOTS", label: "Mitigated Risks", value: "48 Resolved", change: "0 Breaches", isPositive: true, type: "quant" },
  { id: "5", symbol: "HOURS-SAVED", label: "Labor Reduced", value: "14,250 hrs", change: "-64% OPEX", isPositive: true, type: "enterprise" },
  { id: "6", symbol: "S&P 500", label: "Index", value: "5,752.48", change: "+0.84%", isPositive: true, type: "market" },
  { id: "7", symbol: "CASH-RESERVES", label: "Sovereign Liquidity", value: "$42.85M", change: "+$3.2M MTD", isPositive: true, type: "quant" },
  { id: "8", symbol: "VaR-99%", label: "Value at Risk", value: "$410K", change: "Safe Margin", isPositive: true, type: "quant" },
  { id: "9", symbol: "CONTRACTS", label: "Audited Covenants", value: "312 Docs", change: "100% Compliant", isPositive: true, type: "enterprise" },
  { id: "10", symbol: "US-10Y", label: "Yield", value: "3.94%", change: "-4 bps", isPositive: true, type: "market" },
  { id: "11", symbol: "CUSTOMER-CX", label: "Omnichannel CSAT", value: "98.4%", change: "+4.2 pts", isPositive: true, type: "enterprise" },
  { id: "12", symbol: "BTC/USD", label: "Treasury Asset", value: "$94,820", change: "+3.2%", isPositive: true, type: "market" },
];

export const LiveFinancialTickertape: React.FC = () => {
  return (
    <div className="w-full bg-[#050811]/95 backdrop-blur-md border-b border-gold-500/20 overflow-hidden py-1.5 px-2 relative z-30 select-none">
      {/* Edge gradient fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#050811] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050811] to-transparent z-10 pointer-events-none" />

      {/* Live Badge indicator */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#0B0F19] border border-gold-500/40 shadow-[0_0_10px_rgba(212,175,55,0.25)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
        <span className="text-[10px] font-quant font-bold tracking-wider text-[#D4AF37] uppercase">QUANTIS LIVE</span>
      </div>

      <div className="animate-tickertape flex items-center space-x-8 pl-28">
        {/* Render twice for continuous infinite seamless loop */}
        {[...TICKER_DATA, ...TICKER_DATA].map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="inline-flex items-center space-x-2 text-xs py-0.5 px-2 rounded hover:bg-white/[0.05] transition-colors cursor-pointer group"
          >
            <span className="font-quant font-bold text-white group-hover:text-[#D4AF37] transition-colors">
              {item.symbol}
            </span>
            <span className="font-quant text-slate-300 font-medium">
              {item.value}
            </span>
            {item.change && (
              <span
                className={`font-quant text-[11px] font-semibold px-1.5 py-0.2 rounded ${
                  item.isWarning
                    ? "text-[#FF3366] bg-[#FF3366]/10"
                    : item.isPositive
                    ? "text-[#00FFA3] bg-[#00FFA3]/10"
                    : "text-slate-400 bg-slate-800"
                }`}
              >
                {item.change}
              </span>
            )}
            <span className="text-slate-600">|</span>
          </div>
        ))}
      </div>
    </div>
  );
};
