import React from "react";
import { CopilotChatWindow } from "../components/copilot/CopilotChatWindow.js";
import { ShieldCheck, Sparkles, Building, Landmark, Activity } from "lucide-react";

export const CopilotPage: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Executive Intelligence Header */}
      <div className="glass-panel p-5 rounded-3xl border border-gold-500/30 shadow-[0_0_35px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#FFF] to-[#C5A059] p-[1.5px] shadow-[0_0_15px_rgba(212,175,55,0.4)] shrink-0">
            <div className="w-full h-full bg-[#050811] rounded-[14px] flex items-center justify-center">
              <Landmark className="w-6 h-6 text-[#D4AF37]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-quant text-white tracking-wide">
                Institutional Knowledge & Copilot Vault
              </h2>
              <span className="text-[10px] font-bold font-quant px-2.5 py-0.5 rounded-full bg-gold-500/15 text-[#D4AF37] border border-gold-500/40 uppercase tracking-wider">
                TIER 1 FINANCIAL RAG
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Query cross-departmental covenant databases, treasury disclosures, and verified legal precedents.
            </p>
          </div>
        </div>

        {/* Financial telemetry pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-gold-500/20 text-slate-300 font-medium flex items-center gap-1.5 shadow-2xs">
            <Activity className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-quant">Telemetry: <strong className="text-white">Sub-Second RAG</strong></span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-gold-500/20 text-slate-300 font-medium flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-quant">Engine: <strong className="text-white">Gemini 2.5 Flash</strong></span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-gold-500/15 border border-gold-500/30 text-[#D4AF37] font-medium flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-quant font-bold">Zero-Leak RLS Enforced</span>
          </div>
        </div>
      </div>

      <CopilotChatWindow />
    </div>
  );
};

