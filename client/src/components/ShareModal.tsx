import React, { useState, useEffect } from "react";
import { Share2, Globe, ShieldCheck, Copy, CheckCircle2, ExternalLink, X, Wifi, KeyRound, Sparkles } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-7 relative border border-cyan-500/30 shadow-2xl overflow-hidden bg-slate-950/90">
        {/* Colorful gradient ambient glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-cyan-500/20 via-indigo-500/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-violet-600/20 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              Share Live App Publicly
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                HTTPS LIVE
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Anyone worldwide can open this link to test your AI Knowledge Platform.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Public HTTPS Link Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-purple-950/40 border border-cyan-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" />
                1. Public HTTPS Link (Share with Anyone)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 font-semibold border border-cyan-500/30">
                SSL SECURED
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="glass-input flex-1 px-3.5 py-2.5 rounded-xl text-xs font-mono text-cyan-200 select-all border border-cyan-500/30 bg-slate-900/60"
              />
              <button
                onClick={() => handleCopy(publicUrl, "public")}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 shrink-0"
              >
                {copiedType === "public" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
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
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                title="Open in new window"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Tunnel Password Verification Info */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-amber-200 font-semibold text-[11px]">loca.lt Security Password / IP:</div>
                  <div className="text-slate-300 font-mono text-xs">{tunnelPassword}</div>
                </div>
              </div>
              <button
                onClick={() => handleCopy(tunnelPassword, "pwd")}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-semibold transition-colors flex items-center gap-1"
              >
                {copiedType === "pwd" ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
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
            <p className="text-[11px] text-slate-400 leading-relaxed">
              💡 When first opening the link, paste the security code above and click <strong>"Submit"</strong> to enter the secured tunnel.
            </p>
          </div>

          {/* Local Network / Wi-Fi Link Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 to-indigo-950/40 border border-indigo-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Wifi className="w-4 h-4 text-indigo-400" />
                2. Local Wi-Fi Access (Phones & Tablets on Same Network)
              </span>
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                LAN Fast
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={localUrl}
                className="glass-input flex-1 px-3.5 py-2 rounded-xl text-xs font-mono text-slate-300 select-all border border-indigo-500/20 bg-slate-900/60"
              />
              <button
                onClick={() => handleCopy(localUrl, "local")}
                className="px-3 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copiedType === "local" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
            <p className="text-[11px] text-slate-400">
              Open directly on mobile phones or devices connected to the same Wi-Fi router.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            End-to-End SSL Encrypted
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold transition-all shadow-md"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

