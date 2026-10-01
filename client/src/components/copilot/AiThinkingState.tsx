import React, { useEffect, useState } from "react";
import { Cpu, Sparkles, ShieldCheck, Activity } from "lucide-react";

interface AiThinkingStateProps {
  query?: string;
  stepMessage?: string;
}

export const AiThinkingState: React.FC<AiThinkingStateProps> = ({
  query = "Synthesizing enterprise knowledge & financial risk telemetry...",
  stepMessage,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    "Vector Semantic Search: Grounding query in tenant knowledge vault...",
    "RAG Verification: Enforcing zero-hallucination perimeter...",
    "Agentic Reasoning: Correlating cash flow and risk covenants...",
    "Quant Synthesis: Formatting holographic response with audit trails...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-[#00E5FF]/30 shadow-[0_0_30px_rgba(0,229,255,0.15)] relative overflow-hidden my-3">
      {/* Laser Scanning Line */}
      <div className="absolute inset-0 hologram-laser-sweep pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 relative z-10">
        {/* Pulsating Holographic Quantum Orb */}
        <div className="relative flex items-center justify-center shrink-0">
          <div className="w-16 h-16 rounded-full ai-thinking-orb flex items-center justify-center relative shadow-[0_0_30px_rgba(0,255,163,0.6)]">
            <Cpu className="w-7 h-7 text-[#050811] animate-pulse" />
          </div>
          {/* Outer concentric rotating ring */}
          <div className="absolute -inset-2 rounded-full border border-dashed border-[#00E5FF]/40 animate-spin" style={{ animationDuration: "12s" }} />
          <div className="absolute -inset-4 rounded-full border border-[#7000FF]/25 animate-ping" style={{ animationDuration: "3s" }} />
        </div>

        {/* Status text & dancing waveform */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse" />
            <span className="text-[11px] font-quant font-bold tracking-wider text-[#00FFA3] uppercase">
              QUANTIS REASONING ENGINE ACTIVE
            </span>
            <span className="text-[10px] font-quant text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/20">
              GROUNDED RAG
            </span>
          </div>

          <p className="text-sm font-medium text-slate-100 mb-2">
            {stepMessage || steps[activeStep]}
          </p>

          {/* Dancing Waveform Bars */}
          <div className="flex items-center justify-center sm:justify-start space-x-1 h-7">
            <span className="w-1 bg-[#00FFA3] rounded-full waveform-bar-1" />
            <span className="w-1 bg-[#00E5FF] rounded-full waveform-bar-2" />
            <span className="w-1 bg-[#7000FF] rounded-full waveform-bar-3" />
            <span className="w-1 bg-[#00FFA3] rounded-full waveform-bar-4" />
            <span className="w-1 bg-[#00E5FF] rounded-full waveform-bar-5" />
            <span className="w-1 bg-[#7000FF] rounded-full waveform-bar-2" />
            <span className="w-1 bg-[#00FFA3] rounded-full waveform-bar-1" />
            <span className="w-1 bg-[#00E5FF] rounded-full waveform-bar-3" />
            <span className="text-[10px] font-quant text-slate-400 ml-2">
              Gemini 2.5 Flash • 1.4ms Ingest
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
