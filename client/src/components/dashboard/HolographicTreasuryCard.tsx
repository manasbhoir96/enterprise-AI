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
  const [unitMode, setUnitMode] = useState<"usd" | "gold">("usd");
  const [verifying, setVerifying] = useState(false);
  const [verifiedTime, setVerifiedTime] = useState("Just now");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max 14 degree tilt on X and Y
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
        className="preserve-3d relative rounded-3xl bg-white border-2 border-gold-400/70 p-6 md:p-8 shadow-2xl overflow-hidden banknote-guilloche hologram-scanline group"
      >
        {/* Holographic Security Rainbow Thread across the Card */}
        <div className="absolute top-0 right-16 w-12 h-full money-hologram-ribbon opacity-75 pointer-events-none transform -skew-x-12 translate-z-10 flex flex-col justify-around py-4 items-center overflow-hidden">
          <span className="text-[9px] font-black tracking-widest text-slate-900/80 -rotate-90 whitespace-nowrap font-mono">
            ★ SECURE ★
          </span>
          <span className="text-[9px] font-black tracking-widest text-slate-900/80 -rotate-90 whitespace-nowrap font-mono">
            SOVEREIGN
          </span>
          <span className="text-[9px] font-black tracking-widest text-slate-900/80 -rotate-90 whitespace-nowrap font-mono">
            24K GOLD
          </span>
          <span className="text-[9px] font-black tracking-widest text-slate-900/80 -rotate-90 whitespace-nowrap font-mono">
            VALIDATED
          </span>
        </div>

        {/* Ambient Hologram Sheen on Hover */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${rotation.y * 5 + 50}% ${-rotation.x * 5 + 50}%, rgba(212, 175, 55, 0.22) 0%, rgba(0, 245, 255, 0.12) 40%, transparent 70%)`,
          }}
        />

        {/* Card Header & 3D Badges */}
        <div className="flex flex-wrap items-start justify-between gap-4 relative z-10 translate-z-30 mb-6">
          <div className="flex items-center space-x-3.5">
            {/* 3D Spinning Gold Medallion */}
            <div className="perspective-800">
              <div className="gold-coin-3d animate-coin-spin cursor-pointer hover:scale-110 transition-transform">
                <div className="gold-coin-rim"></div>
                <div className="relative text-white font-serif-luxury font-black text-2xl drop-shadow-md">
                  $
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-900 font-mono px-2 py-0.5 rounded bg-gold-100/90 border border-gold-400/80 shadow-2xs">
                  Institutional Reserve
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 font-bold flex items-center gap-1 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  HSM Level 5 Multi-Sig
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 font-serif-luxury tracking-wide mt-1">
                Sovereign Treasury Vault & Liquid Capital
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Cryptographically audited balance backed by tier-1 custodial reserves and gold bullion certificates.
              </p>
            </div>
          </div>

          {/* Unit Toggle and Verification Button */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center rounded-xl bg-[#FCFBF8] p-1 border border-gold-300 shadow-2xs">
              <button
                type="button"
                onClick={() => setUnitMode("usd")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  unitMode === "usd"
                    ? "gold-foil-btn text-white shadow-goldSoft"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setUnitMode("gold")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  unitMode === "gold"
                    ? "gold-foil-btn text-white shadow-goldSoft"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Troy Oz (XAU)
              </button>
            </div>

            <button
              onClick={triggerVerification}
              disabled={verifying}
              className="p-2.5 rounded-xl bg-white hover:bg-gold-50 text-gold-900 border border-gold-300 hover:border-gold-500 transition-all shadow-2xs hover:scale-105"
              title="Re-verify Holographic Cryptographic Proof"
            >
              <RefreshCw className={`w-4 h-4 text-gold-700 ${verifying ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Big Monetary Telemetry Value with 3D Popout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10 translate-z-40">
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl md:text-5xl font-black text-slate-900 font-serif-luxury tracking-tight drop-shadow-sm">
                {unitMode === "usd" ? "$48,250,000.00" : "19,300.00 oz"}
              </span>
              <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                +14.8% YTD Alpha
              </span>
            </div>

            <p className="text-xs text-slate-600 font-mono flex items-center gap-2">
              <span>Cryptographic Proof:</span>
              <code className="text-gold-900 font-bold bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
                0x7F2A...B94C8E
              </code>
              <span>•</span>
              <span className="text-slate-500">Audited: {verifiedTime}</span>
            </p>
          </div>

          {/* 3D Holographic Currency Security Strip */}
          <div className="lg:col-span-5 money-hologram-badge p-4 rounded-2xl border-2 border-gold-400 shadow-md space-y-2 translate-z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 font-serif">
                <Award className="w-4 h-4 text-gold-700" />
                <span>Hologram Seal: Bank of International Settlement</span>
              </div>
              <span className="text-[10px] font-mono font-black text-gold-900 bg-gold-200/80 px-1.5 py-0.5 rounded">
                CLASS AAA
              </span>
            </div>

            <p className="text-[11px] text-slate-700 leading-relaxed font-sans">
              Real-time covenant validation guaranteeing 100% statutory liquidity coverage ratio (LCR) under Basel III and Federal Reserve rules.
            </p>

            <div className="pt-2 border-t border-gold-300/60 flex items-center justify-between text-[10px] font-mono text-slate-600">
              <span>Custody: J.P. Morgan & Sovereign Vault</span>
              <span className="font-bold text-emerald-800">100% COLLATERALIZED</span>
            </div>
          </div>
        </div>

        {/* 4 Micro Fiduciary Metrics along Bottom */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-gold-200/80 relative z-10 translate-z-20">
          <div className="p-3 rounded-xl bg-[#FCFBF8] border border-gold-200/80 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-serif">
              Liquid Cash Equiv.
            </p>
            <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">$18,400,000</p>
            <p className="text-[9px] text-emerald-700 font-medium">Overnight Repos</p>
          </div>

          <div className="p-3 rounded-xl bg-[#FCFBF8] border border-gold-200/80 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-serif">
              Allocated Bullion
            </p>
            <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">7,500 oz Bar</p>
            <p className="text-[9px] text-gold-800 font-medium">Zurich Vault Custody</p>
          </div>

          <div className="p-3 rounded-xl bg-[#FCFBF8] border border-gold-200/80 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-serif">
              Covenant Buffer
            </p>
            <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">340 bps</p>
            <p className="text-[9px] text-emerald-700 font-medium">Above Regulatory Floor</p>
          </div>

          <div className="p-3 rounded-xl bg-[#FCFBF8] border border-gold-200/80 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-serif">
              Audit Encryption
            </p>
            <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">AES-256-GCM</p>
            <p className="text-[9px] text-gold-800 font-medium">Post-Quantum Lattice</p>
          </div>
        </div>
      </div>
    </div>
  );
};
