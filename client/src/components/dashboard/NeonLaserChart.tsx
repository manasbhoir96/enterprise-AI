import React, { useState } from "react";
import { TrendingUp, Sparkles, Activity, ShieldCheck, ArrowUpRight } from "lucide-react";

interface DataPoint {
  time: string;
  revenue: number;
  alpha: number;
  varBound: number;
}

const DATA_1M: DataPoint[] = [
  { time: "W1", revenue: 24.2, alpha: 1.8, varBound: 21.0 },
  { time: "W2", revenue: 27.5, alpha: 2.1, varBound: 22.4 },
  { time: "W3", revenue: 26.8, alpha: 2.4, varBound: 23.1 },
  { time: "W4", revenue: 31.4, alpha: 2.9, varBound: 25.8 },
  { time: "W5", revenue: 34.2, alpha: 3.2, varBound: 28.0 },
  { time: "W6", revenue: 38.6, alpha: 3.4, varBound: 31.2 },
  { time: "W7", revenue: 42.85, alpha: 3.48, varBound: 34.5 },
];

export const NeonLaserChart: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<"revenue" | "alpha">("revenue");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(6);

  // SVG coordinate calculations
  const width = 640;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const points = DATA_1M;
  const maxVal = 50;
  const minVal = 15;

  const getCoordinates = (val: number, idx: number) => {
    const x = paddingX + (idx / (points.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - paddingY * 2);
    return { x, y };
  };

  const linePath = points
    .map((p, i) => {
      const { x, y } = getCoordinates(p.revenue, i);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const areaPath = `${linePath} L ${width - paddingX} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`;

  const alphaPath = points
    .map((p, i) => {
      // Scale alpha to look distinct
      const scaled = 20 + p.alpha * 7;
      const { x, y } = getCoordinates(scaled, i);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const currentHovered = hoveredIdx !== null ? points[hoveredIdx] : points[points.length - 1];

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-gold-500/30 shadow-[0_0_30px_rgba(197,160,89,0.12)] relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3 relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[11px] font-quant font-bold tracking-wider text-[#D4AF37] uppercase">
              HIGH-FREQUENCY QUANT TELEMETRY
            </span>
          </div>
          <div className="flex items-baseline space-x-3 mt-1">
            <h3 className="text-2xl font-bold font-quant text-white">
              ${currentHovered.revenue.toFixed(2)}M
            </h3>
            <span className="text-xs font-quant font-bold text-[#00FFA3] flex items-center bg-[#00FFA3]/10 px-2 py-0.5 rounded border border-[#00FFA3]/30">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +18.4% YTD
            </span>
            <span className="text-xs font-quant text-slate-300">
              Alpha: <strong className="text-[#D4AF37]">{currentHovered.alpha}</strong>
            </span>
          </div>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center space-x-2 self-start sm:self-center">
          <div className="flex items-center p-1 rounded-lg bg-black/60 border border-white/10">
            <button
              onClick={() => setActiveMetric("revenue")}
              className={`px-2.5 py-1 text-xs font-quant font-semibold rounded ${
                activeMetric === "revenue"
                  ? "bg-[#D4AF37] text-[#050811] font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Enterprise Liquidity
            </button>
            <button
              onClick={() => setActiveMetric("alpha")}
              className={`px-2.5 py-1 text-xs font-quant font-semibold rounded ${
                activeMetric === "alpha"
                  ? "bg-white text-[#050811] font-bold shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sharpe Alpha
            </button>
          </div>
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative mt-4 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-52 overflow-visible select-none"
        >
          <defs>
            {/* Gold Laser Glow Area */}
            <linearGradient id="neonGoldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#C5A059" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#0B0F19" stopOpacity="0" />
            </linearGradient>

            {/* Glowing Drop Shadow Filters for Laser Lines */}
            <filter id="laserGlowGold" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#D4AF37" floodOpacity="0.9" />
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#C5A059" floodOpacity="0.5" />
            </filter>

            <filter id="laserGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00E5FF" floodOpacity="0.9" />
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#7000FF" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[20, 30, 40].map((val) => {
            const { y } = getCoordinates(val, 0);
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748B"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                >
                  ${val}M
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#neonGoldGradient)" />

          {/* Secondary Alpha Laser Line */}
          <path
            d={alphaPath}
            fill="none"
            stroke="#00E5FF"
            strokeWidth="2"
            filter="url(#laserGlowCyan)"
            strokeDasharray="6 4"
            opacity="0.85"
          />

          {/* Primary Revenue Laser Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#D4AF37"
            strokeWidth="3.2"
            filter="url(#laserGlowGold)"
          />

          {/* Interactive Data Nodes */}
          {points.map((p, idx) => {
            const { x, y } = getCoordinates(p.revenue, idx);
            const isHovered = hoveredIdx === idx;
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
              >
                {/* Invisible hover hitbox */}
                <circle cx={x} cy={y} r="14" fill="transparent" />

                {/* Visible glowing node */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill="#050811"
                  stroke={isHovered ? "#D4AF37" : "#00E5FF"}
                  strokeWidth={isHovered ? "3" : "2"}
                  className="transition-all duration-200"
                />
                {isHovered && (
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}
                {/* X axis labels */}
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  fill={isHovered ? "#D4AF37" : "#94A3B8"}
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  fontWeight={isHovered ? "bold" : "normal"}
                >
                  {p.time}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Laser Chart Legend */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-slate-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]" />
            <span className="font-quant text-[11px] text-white">Revenue Trajectory ($M)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-[#00E5FF] rounded-full shadow-[0_0_8px_#00E5FF]" />
            <span className="font-quant text-[11px] text-slate-300">Alpha Risk Premium (Sharpe)</span>
          </div>
        </div>
        <span className="font-quant text-[10px] text-slate-400">
          MONTE CARLO (99% CONFIDENCE)
        </span>
      </div>
    </div>
  );
};
