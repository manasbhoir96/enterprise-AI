import React, { useState } from "react";
import { HelpCircle, Sparkles, FileText, Bot, Cpu, ChevronDown, ChevronUp, ArrowRight, X, Landmark, Scale, ShieldCheck } from "lucide-react";

interface HelpGuideBannerProps {
  onNavigate: (path: string) => void;
}

export const HelpGuideBanner: React.FC<HelpGuideBannerProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem("nexus_help_guide_closed") !== "true";
  });

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    localStorage.setItem("nexus_help_guide_closed", (!next).toString());
  };

  if (!isOpen) {
    return (
      <div className="flex justify-end">
        <button
          onClick={toggle}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-gold-50 text-gold-900 border border-gold-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
        >
          <HelpCircle className="w-3.5 h-3.5 text-gold-600" />
          Executive Protocol Guide
          <ChevronDown className="w-3.5 h-3.5 text-gold-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-white border border-gold-400/40 shadow-luxuryCard relative overflow-hidden animate-in fade-in gold-card-sheen">
      {/* Background warm gold sheen */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-start justify-between gap-4 mb-5 relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-600 via-gold-500 to-amber-600 flex items-center justify-center shadow-goldSoft border border-gold-300">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-serif-luxury">
              Executive Onboarding & Fiduciary Protocol
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-900 border border-gold-300 font-serif">
                3-STAGE GOVERNANCE
              </span>
            </h3>
            <p className="text-xs text-slate-600">
              Nexus Sovereign ingests institutional contracts, evaluates regulatory risk, and delivers auditable AI synthesis.
            </p>
          </div>
        </div>

        <button
          onClick={toggle}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-gold-50 transition-colors"
          title="Dismiss Guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {/* Step 1 */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF8F5] to-white border border-gold-300/40 hover:border-gold-500 hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[9px] font-bold font-serif px-2 py-0.5 rounded-md bg-gold-100 text-gold-900 border border-gold-300">
                PROTOCOL 01
              </span>
              <FileText className="w-4 h-4 text-gold-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 mb-1 font-serif-luxury">Institutional Vault</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Explore pre-seeded Master Services Agreements (MSAs), ISO runbooks, and Q3 financial performance audits.
            </p>
          </div>
          <button
            onClick={() => onNavigate("/knowledge-base")}
            className="mt-3.5 text-[11px] font-bold text-gold-800 group-hover:text-gold-950 flex items-center gap-1 font-serif"
          >
            Access Vault <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF8F5] to-white border border-gold-300/40 hover:border-gold-500 hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[9px] font-bold font-serif px-2 py-0.5 rounded-md bg-gold-100 text-gold-900 border border-gold-300">
                PROTOCOL 02
              </span>
              <Bot className="w-4 h-4 text-gold-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 mb-1 font-serif-luxury">Sovereign Copilot</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Query covenants like <em>"What are our indemnification caps?"</em> and receive instant citations from your vault.
            </p>
          </div>
          <button
            onClick={() => onNavigate("/copilot")}
            className="mt-3.5 text-[11px] font-bold text-gold-800 group-hover:text-gold-950 flex items-center gap-1 font-serif"
          >
            Open Copilot Chamber <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF8F5] to-white border border-gold-300/40 hover:border-gold-500 hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[9px] font-bold font-serif px-2 py-0.5 rounded-md bg-gold-100 text-gold-900 border border-gold-300">
                PROTOCOL 03
              </span>
              <Scale className="w-4 h-4 text-gold-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 mb-1 font-serif-luxury">Audit & Compliance Engine</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Execute automated risk reviews with structured JSON schema outputs and immutable compliance logging.
            </p>
          </div>
          <button
            onClick={() => onNavigate("/workflows")}
            className="mt-3.5 text-[11px] font-bold text-gold-800 group-hover:text-gold-950 flex items-center gap-1 font-serif"
          >
            Run Audit Workflows <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
