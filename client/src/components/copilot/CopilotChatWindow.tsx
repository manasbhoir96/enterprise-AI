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
} from "lucide-react";
import { apiRequest } from "../../lib/api.js";
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
      text: `Hello, I am **NexusAI**, your organization's enterprise AI copilot. I am strictly grounded in your company's uploaded policies, legal contracts, and departmental guidelines.\n\nHow may I assist your workflow today?`,
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
    "What is our travel reimbursement policy for international flights?",
    "What are our aggregate liability limits in the Cloud MSA?",
    "What is the policy for unused PTO rollover and parental leave?",
    "What are our SOC2 password rotation and hardware MFA rules?",
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
        text: `⚠️ **Error retrieving context:** ${err.message || "Failed to query organizational knowledge."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: "copilot",
        text: `Conversation cleared. I am ready to answer enterprise questions based on your organization's verified data.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const renderFormattedText = (text: string) => {
    // Basic Markdown parser for headers, bold, and bullet points
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="text-sm font-bold text-white mt-3 mb-1">{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-base font-bold text-white mt-3 mb-1.5">{line.replace("## ", "")}</h3>;
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-300 my-0.5 leading-relaxed">
            {formatBold(line.substring(2))}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-slate-300 my-0.5 leading-relaxed">
            {formatBold(line.replace(/^\d+\.\s/, ""))}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5"></div>;
      }
      return <p key={idx} className="text-xs text-slate-300 leading-relaxed my-0.5">{formatBold(line)}</p>;
    });
  };

  const formatBold = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-slate-100">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] glass-panel rounded-2xl overflow-hidden relative border border-white/10">
      {/* Top Controls Bar */}
      <div className="p-4 border-b border-white/5 bg-nexus-900/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-glow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Context-Aware Enterprise Copilot
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Grounding Active
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Answers are strictly grounded in Acme Corporation's internal knowledge base.
            </p>
          </div>
        </div>

        {/* Filter and Clear Chat */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Scope:</span>
            <select
              value={departmentContext}
              onChange={(e) => setDepartmentContext(e.target.value)}
              className="glass-input px-2.5 py-1 rounded-lg text-xs bg-nexus-900"
            >
              <option value="All Departments">All Departments</option>
              <option value="Legal & Compliance">Legal & Compliance</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance & Accounting">Finance & Accounting</option>
              <option value="Operations & Supply Chain">Operations & Supply Chain</option>
            </select>
          </div>

          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? "bg-indigo-600 text-white shadow-glow"
                    : "bg-slate-800 text-indigo-400 border border-indigo-500/30"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 border ${
                  isUser
                    ? "bg-indigo-600/30 text-slate-100 border-indigo-500/40 rounded-tr-none"
                    : "glass-panel text-slate-200 border-white/5 rounded-tl-none shadow-sm"
                }`}
              >
                {renderFormattedText(msg.text)}

                {/* Citations Box */}
                {!isUser && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-indigo-400" />
                      Grounded Citations ({msg.citations.length} Verified Sources)
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cite) => (
                        <button
                          key={cite.id}
                          onClick={() => setActiveCitation(cite)}
                          className="px-2 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-indigo-300 border border-indigo-500/20 text-[10px] font-medium flex items-center gap-1 transition-all"
                        >
                          <span className="truncate max-w-[140px]">{cite.title}</span>
                          <span className="text-[8px] uppercase font-mono px-1 rounded bg-indigo-500/20 text-indigo-200">
                            {cite.classification}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta footer */}
                <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1">
                  <span>{msg.timestamp}</span>
                  {!isUser && msg.latencyMs && (
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-2.5 h-2.5" />
                      {msg.latencyMs}ms ({msg.modelUsed || "gemini-2.5-flash"})
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3 animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <div className="glass-panel p-3.5 rounded-2xl rounded-tl-none border-white/5 flex items-center space-x-2 text-xs text-indigo-300">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></div>
              <span className="text-[11px] text-slate-400 ml-2">Retrieving organizational context and synthesizing with Gemini...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-4 py-2 border-t border-white/5 bg-nexus-900/30 flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
          Suggested:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-200 border border-white/5 hover:border-indigo-500/30 text-[10px] whitespace-nowrap transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-white/5 bg-nexus-900/80 shrink-0">
        <div className="relative flex items-center">
          <textarea
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask NexusAI about ${departmentContext.toLowerCase()} policies, MSAs, or compliance... (Enter to send)`}
            className="glass-input w-full pl-4 pr-12 py-3 rounded-xl text-xs resize-none leading-relaxed"
          ></textarea>
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white shadow-glow transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Citation Detail Modal */}
      {activeCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 relative border border-white/10 shadow-2xl">
            <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              {activeCitation.title}
            </h4>
            <div className="flex items-center gap-2 mb-3 text-[11px] text-slate-400">
              <span>Dept: {activeCitation.departmentTag || "General"}</span>
              <span>•</span>
              <span className="font-mono uppercase font-bold text-indigo-300">
                {activeCitation.classification}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-nexus-950 font-mono text-xs text-slate-300 leading-relaxed border border-white/5 max-h-60 overflow-y-auto mb-4">
              "{activeCitation.snippet}"
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveCitation(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors"
              >
                Close Citation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
