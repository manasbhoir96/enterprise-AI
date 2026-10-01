import React, { useState } from "react";
import { HelpCircle, Sparkles, FileText, Bot, Cpu, ChevronDown, ChevronUp, ArrowRight, X } from "lucide-react";

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
          className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Show Quick Help Guide
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-r from-violet-950/60 via-indigo-950/40 to-cyan-950/60 border border-indigo-500/30 shadow-xl relative overflow-hidden animate-in fade-in">
      {/* Background colorful radiant glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              Welcome to NexusAI — How It Works
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                EASY 3-STEP TOUR
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              NexusAI is your company's smart AI assistant that reads your verified documents to answer questions and review contracts.
            </p>
          </div>
        </div>

        <button
          onClick={toggle}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Hide Guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
        {/* Step 1 */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-violet-500/40 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30">
                STEP 1
              </span>
              <FileText className="w-4 h-4 text-violet-400" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Company Documents</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              We pre-loaded sample Employee Handbooks, Cloud MSAs, and Financial Reports. You can also upload your own.
            </p>
          </div>
          <button
            onClick={() => onNavigate("/knowledge-base")}
            className="mt-3 text-[11px] font-semibold text-violet-400 group-hover:text-violet-300 flex items-center gap-1"
          >
            Open Document Hub <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Step 2 */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                STEP 2
              </span>
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Ask the AI Copilot</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Ask questions like <em>"What is our travel flight policy?"</em> and get instant answers citing your exact documents.
            </p>
          </div>
          <button
            onClick={() => onNavigate("/copilot")}
            className="mt-3 text-[11px] font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1"
          >
            Try the Copilot <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Step 3 */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                STEP 3
              </span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Automate Contract Audits</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Click <strong>"Execute AI Workflow"</strong> to analyze contract clauses and receive an executive 1-10 risk breakdown.
            </p>
          </div>
          <button
            onClick={() => onNavigate("/workflows")}
            className="mt-3 text-[11px] font-semibold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1"
          >
            Run an AI Workflow <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
