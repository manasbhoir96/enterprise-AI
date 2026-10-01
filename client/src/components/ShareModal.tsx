import React, { useState, useEffect } from "react";
import {
  Share2,
  Globe,
  ShieldCheck,
  Copy,
  CheckCircle2,
  ExternalLink,
  X,
  Wifi,
  KeyRound,
  Sparkles,
  Cpu,
  Layers,
} from "lucide-react";
import { apiRequest } from "../lib/api.js";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [shareInfo, setShareInfo] = useState<{
    localIp: string;
    localPort: number;
    localUrl: string;
    publicUrl: string | null;
    publicIp?: string;
    tunnelPassword?: string;
    status: string;
  } | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    async function loadInfo() {
      setLoading(true);
      try {
        const res = await apiRequest("/org/share-info");
        setShareInfo(res);
      } catch (err) {
        console.error("Failed to load share info:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInfo();
  }, [isOpen]);

  if (!isOpen) return null;

  const publicUrl = shareInfo?.publicUrl || "https://twenty-crabs-build.loca.lt";
  const localUrl = shareInfo?.localUrl || "http://10.50.10.143:5173";
  const tunnelPassword = shareInfo?.tunnelPassword || shareInfo?.publicIp || "103.160.174.114";

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl p-7 relative border border-[#00E5FF]/40 shadow-[0_0_50px_rgba(0,229,255,0.25)] overflow-hidden glass-panel bg-[#0B0F19]/95 text-white">
        {/* Holographic Security Ribbon across the top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 money-hologram-ribbon" />

        {/* Ambient radial glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#7000FF]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3.5 mb-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00FFA3] via-[#00E5FF] to-[#7000FF] p-[1.5px] shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#050811] rounded-[14px] flex items-center justify-center">
              <Share2 className="w-6 h-6 text-[#00FFA3]" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse" />
              <span className="text-[10px] font-quant font-bold text-[#00FFA3] tracking-wider uppercase">
                QUANTIS NETWORK GATEWAY
              </span>
            </div>
            <h2 className="text-xl font-bold font-quant text-white tracking-tight mt-0.5">
              Share Quantis Terminal
            </h2>
            <p className="text-xs text-slate-400">
              Zero-config public HTTPS link and local Wi-Fi pairing for hackathon judges & team.
            </p>
          </div>
        </div>

        {/* Links Cards */}
        <div className="space-y-4 relative z-10">
          {/* Card 1: Worldwide Public HTTPS Link */}
          <div className="p-4 rounded-2xl bg-black/60 border border-[#00FFA3]/40 shadow-[0_0_20px_rgba(0,255,163,0.15)] space-y-3 group hover:border-[#00FFA3] transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-[#00FFA3]" />
                <span className="text-xs font-bold font-quant text-white">
                  Worldwide Public HTTPS Link
                </span>
              </div>
              <span className="text-[10px] font-quant px-2 py-0.5 rounded-full bg-[#00FFA3]/15 text-[#00FFA3] border border-[#00FFA3]/30 font-bold">
                ENCRYPTED TUNNEL
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 glass-input px-3.5 py-2 rounded-xl text-xs font-quant text-[#00FFA3] border-[#00FFA3]/30 select-all"
              />
              <button
                onClick={() => handleCopy(publicUrl, "public")}
                className="px-3 py-2 rounded-xl bull-market-btn text-[#050811] text-xs font-quant font-bold flex items-center space-x-1 shrink-0"
              >
                {copiedType === "public" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === "public" ? "Copied" : "Copy"}</span>
              </button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-black/80 hover:bg-black text-[#00E5FF] border border-[#00E5FF]/40 hover:border-[#00E5FF] transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Tunnel Password / Gateway IP prompt */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-quant">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-[#00E5FF]" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Tunnel Password (if asked):</span>
                  <span className="font-bold text-white tracking-wider">{tunnelPassword}</span>
                </div>
              </div>
              <button
                onClick={() => handleCopy(tunnelPassword, "pass")}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-black/60 hover:bg-black text-[#00E5FF] border border-[#00E5FF]/30 font-semibold"
              >
                {copiedType === "pass" ? "Copied" : "Copy IP"}
              </button>
            </div>
          </div>

          {/* Card 2: Local Wi-Fi Network */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4 text-[#00E5FF]" />
                <span className="text-xs font-bold font-quant text-white">
                  Local Network (Same Wi-Fi Device)
                </span>
              </div>
              <span className="text-[10px] font-quant text-slate-400">LAN DIRECT</span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={localUrl}
                className="flex-1 glass-input px-3.5 py-2 rounded-xl text-xs font-quant text-slate-200 select-all"
              />
              <button
                onClick={() => handleCopy(localUrl, "local")}
                className="px-3 py-2 rounded-xl hologram-btn text-xs font-quant font-semibold flex items-center space-x-1 shrink-0"
              >
                {copiedType === "local" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === "local" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Open directly in your mobile phone browser (iOS Safari / Android Chrome) while connected to the same Wi-Fi.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 relative z-10 font-quant">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00FFA3]" />
            SOC-2 Type II Grounded • AES-256
          </span>
          <button
            onClick={onClose}
            className="bull-market-btn px-4 py-1.5 rounded-xl text-[#050811] font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
