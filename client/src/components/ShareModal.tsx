import React, { useState, useEffect } from "react";
import { Share2, Globe, ShieldCheck, Copy, CheckCircle2, ExternalLink, X, Wifi, KeyRound, Sparkles, Landmark, Award } from "lucide-react";
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

  const publicUrl = shareInfo?.publicUrl || "https://wide-files-like.loca.lt";
  const localUrl = shareInfo?.localUrl || "http://10.50.10.143:5173";
  const tunnelPassword = shareInfo?.tunnelPassword || shareInfo?.publicIp || "103.160.174.114";

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl p-7 relative border border-gold-400/50 shadow-cardHover overflow-hidden bg-white gold-card-sheen">
        {/* Subtle gold ambient glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-gold-300/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-amber-200/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-gold-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-600 via-gold-500 to-amber-600 flex items-center justify-center shadow-goldSoft border border-gold-300">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-serif-luxury">
              Share Sovereign Workspace
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-900 border border-gold-300 flex items-center gap-1 font-serif">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                HTTPS LIVE
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Grant remote access to partners, evaluators, or clients anywhere in the world.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Public HTTPS Link Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-gold-50/80 via-white to-amber-50/50 border border-gold-300/80 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-serif-luxury">
                <Globe className="w-4 h-4 text-gold-700" />
                1. Sovereign HTTPS Link (Worldwide Access)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold-100 text-gold-900 font-bold border border-gold-300">
                SSL 256-BIT
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="glass-input flex-1 px-3.5 py-2.5 rounded-xl text-xs font-mono text-slate-800 select-all border border-gold-300/80 bg-white"
              />
              <button
                onClick={() => handleCopy(publicUrl, "public")}
                className="gold-foil-btn px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                {copiedType === "public" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-gold-50 hover:bg-gold-100 text-gold-900 border border-gold-200 transition-colors"
                title="Open in new window"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Tunnel Password Verification Info */}
            <div className="p-3 rounded-xl bg-white border border-gold-300/70 flex items-center justify-between text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-gold-700 shrink-0" />
                <div>
                  <div className="text-gold-900 font-bold text-[11px] font-serif">Security Gateway Passcode / IP:</div>
                  <div className="text-slate-700 font-mono text-xs font-semibold">{tunnelPassword}</div>
                </div>
              </div>
              <button
                onClick={() => handleCopy(tunnelPassword, "pwd")}
                className="px-3 py-1.5 rounded-lg bg-gold-100 hover:bg-gold-200 text-gold-900 border border-gold-300 text-[11px] font-bold transition-colors flex items-center gap-1"
              >
                {copiedType === "pwd" ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              💡 When first opening the link in a browser, enter the passcode above and click <strong>"Submit"</strong> to enter the sovereign enclave.
            </p>
          </div>

          {/* Local Network / Wi-Fi Link Box */}
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-serif-luxury">
                <Wifi className="w-4 h-4 text-gold-700" />
                2. Intranet / Local Wi-Fi Access (Phones & Tablets)
              </span>
              <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                Local Fast
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={localUrl}
                className="glass-input flex-1 px-3.5 py-2 rounded-xl text-xs font-mono text-slate-700 select-all border border-slate-200 bg-white"
              />
              <button
                onClick={() => handleCopy(localUrl, "local")}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-gold-50 text-gold-900 border border-gold-300 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                {copiedType === "local" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Open directly on mobile devices connected to the same institutional Wi-Fi router.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gold-200/50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            End-to-End Encrypted Gateway
          </span>
          <button
            onClick={onClose}
            className="gold-foil-btn px-5 py-2 rounded-xl text-white font-bold transition-all shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
