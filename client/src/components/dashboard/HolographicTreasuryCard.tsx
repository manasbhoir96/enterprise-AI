import React, { useState, useRef } from "react";
import {
  Landmark,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Lock,
  Coins,
  RefreshCw,
  Award,
  Zap,
} from "lucide-react";

export const HolographicTreasuryCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [unitMode, setUnitMode] = useState<"usd" | "quant">("usd");
  const [verifying, setVerifying] = useState(false);
  const [verifiedTime, setVerifiedTime] = useState("Just now");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const triggerVerification = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerifiedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1200);
  };

  return (
    <div className="perspective-1000 w-full select-none">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="preserve-3d relative rounded-3xl glass-panel border border-[#00E5FF]/30 p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden group hover:border-[#00FFA3]/60 transition-all duration-300"
      >
        {/* Holographic Laser Sweep */}
        <div className="absolute inset-0 hologram-laser-sweep pointer-events-none" />

        {/* Holographic Security Ribbon across the Card */}
        <div className="absolute top-0 right-16 w-12 h-full money-hologram-ribbon opacity-80 pointer-events-none transform -skew-x-12 translate-z-10 flex flex-col justify-around py-4 items-center overflow-hidden">
          <span className="text-[9px] font-black tracking-widest text-[#050811] -rotate-90 whitespace-nowrap font-quant">
            ★ QUANTIS ★
          </span>
          <span className="text-[9px] font-black tracking-widest text-[#050811] -rotate-90 whitespace-nowrap font-quant">
            SOVEREIGN
          </span>
          <span className="text-[9px] font-black tracking-widest text-[#050811] -rotate-90 whitespace-nowrap font-quant">
            SECURE RAG
          </span>
          <span className="text-[9px] font-black tracking-widest text-[#050811] -rotate-90 whitespace-nowrap font-quant">
            VALIDATED
          </span>
        </div>

        {/* Top Header inside the 3D card */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10 translate-z-20">
          <div className="flex items-center space-x-3.5">
            {/* Spinning Holographic Core Medallion */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00FFA3] via-[#00E5FF] to-[#7000FF] p-[2px] shadow-[0_0_20px_rgba(0,255,163,0.5)] shrink-0">
              <div className="w-full h-full bg-[#050811] rounded-[14px] flex items-center justify-center">
                <Coins className="w-6 h-6 text-[#00FFA3] animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-quant font-bold text-[#00FFA3] bg-[#00FFA3]/10 border border-[#00FFA3]/30">
                  TIER 1 SOVEREIGN ASSET
                </span>
                <span className="text-[10px] font-quant text-slate-400">SERIES 2026-A</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold font-quant text-white mt-0.5">
                Quantis Fiduciary Treasury & Liquidity Ledger
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Currency toggle */}
            <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/10">
              <button
                onClick={() => setUnitMode("usd")}
                className={`px-3 py-1 text-xs font-quant font-semibold rounded-lg transition-all ${
                  unitMode === "usd"
                    ? "bg-[#00FFA3] text-[#050811] font-bold shadow-[0_0_10px_rgba(0,255,163,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setUnitMode("quant")}
                className={`px-3 py-1 text-xs font-quant font-semibold rounded-lg transition-all ${
                  unitMode === "quant"
                    ? "bg-[#00E5FF] text-[#050811] font-bold shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Troy Oz (Au)
              </button>
            </div>

            {/* Cryptographic Verification Button */}
            <button
              onClick={triggerVerification}
              disabled={verifying}
              className="p-2 rounded-xl bg-black/60 hover:bg-black/90 border border-white/10 hover:border-[#00FFA3] text-slate-300 hover:text-[#00FFA3] transition-all flex items-center gap-1.5 text-xs font-quant"
              title="Verify cryptographic proof with smart contract"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${verifying ? "animate-spin text-[#00FFA3]" : ""}`} />
              <span className="hidden sm:inline">{verifying ? "Verifying..." : "Verify Hash"}</span>
            </button>
          </div>
        </div>

        {/* Central Fiduciary Valuation Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center relative z-10 translate-z-30">
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl md:text-5xl font-bold font-quant text-white tracking-tight drop-shadow-[0_0_25px_rgba(0,255,163,0.3)]">
                {unitMode === "usd" ? "$48,250,000.00" : "19,300.00 oz"}
              </span>
              <span className="text-xs font-quant font-bold text-[#00FFA3] bg-[#00FFA3]/10 px-2.5 py-1 rounded-full border border-[#00FFA3]/30 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                +14.8% YTD Alpha
              </span>
            </div>

            <p className="text-xs text-slate-400 font-quant flex items-center gap-2">
              <span>Cryptographic Proof:</span>
              <code className="text-[#00E5FF] font-bold bg-black/50 px-2 py-0.5 rounded border border-[#00E5FF]/30">
                0x7F2A...B94C8E
              </code>
              <span>•</span>
              <span className="text-slate-400">Audited: {verifiedTime}</span>
            </p>
          </div>

          {/* Holographic Currency Security Strip */}
          <div className="lg:col-span-5 p-4 rounded-2xl bg-black/50 border border-[#00E5FF]/30 shadow-lg space-y-2 translate-z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white font-quant">
                <Award className="w-4 h-4 text-[#00FFA3]" />
                <span>Hologram Seal: Bank of International Settlement</span>
              </div>
              <span className="text-[10px] font-quant font-bold text-[#00FFA3] bg-[#00FFA3]/15 px-1.5 py-0.5 rounded border border-[#00FFA3]/30">
                CLASS AAA
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Real-time covenant validation guaranteeing 100% statutory liquidity coverage ratio (LCR) under Basel III and Federal Reserve rules.
            </p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-quant text-slate-400">
              <span>Custody: J.P. Morgan & Sovereign Vault</span>
              <span className="font-bold text-[#00FFA3]">100% COLLATERALIZED</span>
            </div>
          </div>
        </div>

        {/* 4 Micro Fiduciary Metrics along Bottom */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 relative z-10 translate-z-20">
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 shadow-2xs">
            <p className="text-[10px] font-quant font-bold uppercase tracking-wider text-slate-400">
              Liquid Cash Equiv.
            </p>
            <p className="text-sm font-bold text-white font-quant mt-0.5">$18,400,000</p>
            <p className="text-[9px] text-[#00FFA3] font-quant">Overnight Repos</p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 shadow-2xs">
            <p className="text-[10px] font-quant font-bold uppercase tracking-wider text-slate-400">
              Allocated Bullion
            </p>
            <p className="text-sm font-bold text-white font-quant mt-0.5">7,500 oz Bar</p>
            <p className="text-[9px] text-[#00E5FF] font-quant">Zurich Vault Custody</p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 shadow-2xs">
            <p className="text-[10px] font-quant font-bold uppercase tracking-wider text-slate-400">
              Covenant Buffer
            </p>
            <p className="text-sm font-bold text-white font-quant mt-0.5">340 bps</p>
            <p className="text-[9px] text-[#00FFA3] font-quant">Above Regulatory Floor</p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 shadow-2xs">
            <p className="text-[10px] font-quant font-bold uppercase tracking-wider text-slate-400">
              Audit Encryption
            </p>
            <p className="text-sm font-bold text-white font-quant mt-0.5">AES-256-GCM</p>
            <p className="text-[9px] text-[#C084FC] font-quant">Post-Quantum Lattice</p>
          </div>
        </div>
      </div>
    </div>
  );
};
