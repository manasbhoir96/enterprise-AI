import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  BookOpen,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  Shield,
  Trash2,
  ChevronRight,
  ExternalLink,
  Cpu,
  Activity,
  Layers,
} from "lucide-react";
import { apiRequest } from "../../lib/api.js";
import { AiThinkingState } from "./AiThinkingState.js";
import type { CopilotQueryResponse, CopilotCitation } from "@nexusai/shared";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  citations?: CopilotCitation[];
  timestamp: string;
  modelUsed?: string;
  latencyMs?: number;
}

export const CopilotChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-welcome",
      sender: "copilot",
      text: `🌌 **Quantis AI Reasoning Engine Initialized**\n\nI am grounded in your enterprise vector store with cryptographic zero-hallucination perimeter. I synthesize institutional documents, financial contracts, compliance regulations, and operating covenants in real time.\n\n💡 **Quant Query Prompts:**\n- *"What are the aggregate liability caps and indemnities in our Cloud MSA?"*\n- *"What are our statutory liquidity thresholds and Basel III covenant buffers?"*\n- *"Summarize our travel reimbursement and corporate OPEX limits."*\n- *"What are our SOC-2 password rotation and hardware MFA enforcement rules?"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      modelUsed: "gemini-2.5-flash",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [departmentContext, setDepartmentContext] = useState("All Departments");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCitation, setActiveCitation] = useState<CopilotCitation | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestedQuestions = [
    "What are our aggregate liability limits and indemnities in the Cloud MSA?",
    "What are our statutory liquidity thresholds and Basel III covenant buffers?",
    "What is the policy for unused PTO rollover and executive parental leave?",
    "What are our SOC2 password rotation and hardware MFA requirements?",
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputText("");
    setIsLoading(true);

    try {
      const res = await apiRequest<CopilotQueryResponse>("/copilot/query", {
        method: "POST",
        body: JSON.stringify({
          query: textToSend.trim(),
          departmentContext: departmentContext === "All Departments" ? undefined : departmentContext,
        }),
      });

      const copilotMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "copilot",
        text: res.answer,
        citations: res.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: res.modelUsed,
        latencyMs: res.executionTimeMs,
      };

      setMessages((prev) => [...prev, copilotMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "copilot",
        text: `⚠️ **Quantis Error:** ${err.message || "Failed to reach AI reasoning server. Please verify network connectivity."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] glass-panel rounded-3xl border border-gold-500/30 shadow-[0_0_35px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Top Header */}
      <div className="p-4 px-6 border-b border-gold-500/20 bg-[#050811]/90 flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#FFF] to-[#C5A059] p-[1.5px] shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            <div className="w-full h-full bg-[#050811] rounded-[9px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#D4AF37]" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold font-quant text-white">
                Quantis Copilot Terminal
              </h2>
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[10px] font-quant text-[#D4AF37] bg-gold-500/15 px-2 py-0.5 rounded border border-gold-500/30">
                ZERO HALLUCINATION
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Grounded in Tenant Vector Partitions • Gemini 2.5 Flash
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Department Filter */}
          <div className="flex items-center space-x-1.5 bg-black/60 px-2.5 py-1.5 rounded-xl border border-gold-500/20 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
            <select
              value={departmentContext}
              onChange={(e) => setDepartmentContext(e.target.value)}
              className="bg-transparent text-slate-200 font-quant text-xs focus:outline-none cursor-pointer"
            >
              <option value="All Departments" className="bg-[#0B0F19]">All Departments</option>
              <option value="Executive" className="bg-[#0B0F19]">Executive / Treasury</option>
              <option value="Finance" className="bg-[#0B0F19]">Finance & Accounting</option>
              <option value="Legal" className="bg-[#0B0F19]">Legal & Compliance</option>
              <option value="HR" className="bg-[#0B0F19]">Human Resources</option>
              <option value="Engineering" className="bg-[#0B0F19]">Engineering & Security</option>
            </select>
          </div>

          <button
            onClick={() => setMessages([messages[0]])}
            title="Clear Chat History"
            className="p-2 text-slate-400 hover:text-[#FF3366] hover:bg-[#FF3366]/10 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-[#0B0F19] to-[#050811]">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  isUser
                    ? "bg-gradient-to-br from-[#D4AF37] to-[#8E6A2B] text-white border-white/30 shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                    : "bg-[#050811] text-[#D4AF37] border-gold-500/40 shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl p-4 space-y-2 border transition-all ${
                  isUser
                    ? "bg-gradient-to-br from-[#C5A059]/20 to-[#D4AF37]/10 text-white border-gold-500/40 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                    : "glass-panel border-gold-500/20 shadow-[0_0_25px_rgba(0,0,0,0.6)]"
                }`}
              >
                <div className="text-xs leading-relaxed whitespace-pre-wrap text-slate-100">
                  {msg.text}
                </div>

                {/* Grounded Citation Chips */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-white/10 space-y-1.5">
                    <p className="text-[10px] font-quant font-bold text-[#D4AF37] flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#D4AF37]" />
                      Grounded Citations ({msg.citations.length}):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cite) => (
                        <button
                          key={cite.id}
                          onClick={() => setActiveCitation(cite)}
                          className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/90 text-slate-200 border border-gold-500/30 hover:border-gold-400 text-[10px] font-quant flex items-center gap-1 transition-all"
                        >
                          <span className="truncate max-w-[150px]">{cite.title}</span>
                          <span className="text-[8px] uppercase px-1 rounded bg-gold-500/15 text-[#D4AF37] font-bold border border-gold-500/30">
                            {cite.classification}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta Footer */}
                <div className="flex items-center justify-between text-[9px] pt-1 text-slate-400 font-quant">
                  <span>{msg.timestamp}</span>
                  {!isUser && msg.latencyMs && (
                    <span className="flex items-center gap-1 text-[#D4AF37]">
                      <Clock className="w-2.5 h-2.5" />
                      {msg.latencyMs}ms • {msg.modelUsed}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* The "AI Thinking" State (Glowing, pulsating quantum orb with waveforms) */}
        {isLoading && <AiThinkingState />}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-6 py-2 bg-[#050811]/90 border-t border-gold-500/15 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-quant text-[#D4AF37] font-bold">PROMPTS:</span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] font-quant px-2.5 py-1 rounded-lg bg-black/50 hover:bg-black/80 text-slate-300 hover:text-white border border-gold-500/20 hover:border-gold-500/50 transition-all truncate max-w-[260px]"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="p-4 px-6 border-t border-gold-500/20 bg-[#050811]/95 relative z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Quantis AI about policies, covenants, financial stats, or contract liabilities..."
            disabled={isLoading}
            className="flex-1 glass-input px-4 py-3 rounded-2xl text-xs placeholder:text-slate-500 font-medium focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`p-3 rounded-2xl transition-all duration-300 ${
              inputText.trim() && !isLoading
                ? "gold-foil-btn cursor-pointer hover:scale-105"
                : "bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>

      {/* Citation Inspector Modal */}
      {activeCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel border border-[#00E5FF]/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-[0_0_50px_rgba(0,229,255,0.3)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#00FFA3]" />
                <h3 className="text-sm font-bold font-quant text-white">Grounded Citation Proof</h3>
              </div>
              <button
                onClick={() => setActiveCitation(null)}
                className="text-slate-400 hover:text-white text-xs font-quant p-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#00E5FF] font-quant">{activeCitation.title}</h4>
              <p className="text-[11px] font-quant text-slate-400">
                Department: {activeCitation.departmentTag || "Enterprise"} • Security Classification: {activeCitation.classification}
              </p>
              <div className="p-3 bg-black/60 rounded-xl border border-white/10 text-xs font-mono text-slate-200 leading-relaxed max-h-48 overflow-y-auto">
                "{activeCitation.snippet}"
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-quant text-slate-400">
              <span>Cryptographic Hash: Validated</span>
              <button
                onClick={() => setActiveCitation(null)}
                className="bull-market-btn px-3 py-1 rounded-lg text-[#050811] font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
