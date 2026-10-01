import React from "react";
import { CopilotChatWindow } from "../components/copilot/CopilotChatWindow.js";
import { ShieldCheck, Sparkles, Building, Landmark, Activity } from "lucide-react";

export const CopilotPage: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Executive Intelligence Header */}
      <div className="bg-white p-5 rounded-3xl border border-gold-300/80 shadow-luxuryCard flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500 to-amber-700 flex items-center justify-center text-white shadow-goldSoft border border-gold-300">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 font-serif-luxury tracking-wide">
                Institutional Knowledge & Copilot Vault
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-100 text-gold-900 border border-gold-300 uppercase tracking-wider font-mono">
                Tier 1 Financial RAG
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Query cross-departmental covenant databases, treasury disclosures, and verified legal precedents.
            </p>
          </div>
        </div>

        {/* Financial telemetry pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-gold-50 border border-gold-200 text-gold-900 font-medium flex items-center gap-1.5 shadow-2xs">
            <Activity className="w-3.5 h-3.5 text-gold-700" />
            <span>Telemetry: <strong className="font-mono">Sub-Second RAG</strong></span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#FCFBF8] border border-gold-200 text-slate-700 font-medium flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Engine: <strong className="font-mono text-gold-800">Gemini 3.8 Flash</strong></span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero-Leak RLS Enforced</span>
          </div>
        </div>
      </div>

      <CopilotChatWindow />
    </div>
  );
};

