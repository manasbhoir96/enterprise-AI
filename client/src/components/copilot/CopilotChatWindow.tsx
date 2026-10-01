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
      text: `👋 **Welcome! I'm your Company AI Copilot.**\n\nI answer questions strictly based on your company's uploaded documents (like employee handbooks, vendor contracts, and security policies).\n\n💡 **Try asking:**\n- *"What is our travel reimbursement policy for flights?"*\n- *"What are our liability limits in the Cloud MSA?"*\n- *"How many sick and PTO days do we get?"*`,
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
        return <h4 key={idx} className="text-sm font-bold text-slate-900 font-serif-luxury mt-3 mb-1">{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-base font-bold text-slate-900 font-serif-luxury mt-3 mb-1.5">{line.replace("## ", "")}</h3>;
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 my-0.5 leading-relaxed">
            {formatBold(line.substring(2))}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-slate-700 my-0.5 leading-relaxed">
            {formatBold(line.replace(/^\d+\.\s/, ""))}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5"></div>;
      }
      return <p key={idx} className="text-xs text-slate-700 leading-relaxed my-0.5">{formatBold(line)}</p>;
    });
  };

  const formatBold = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-white rounded-3xl overflow-hidden relative border border-gold-300/80 shadow-luxuryCard">
      {/* Top Controls Bar */}
      <div className="p-4 border-b border-gold-200/80 bg-[#FCFBF8] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-gold-600 via-amber-600 to-yellow-500 flex items-center justify-center shadow-goldSoft text-white">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-serif-luxury tracking-wide flex items-center gap-2">
              Sovereign Copilot
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gold-50 text-gold-900 border border-gold-300/80 flex items-center gap-1">
                <Shield className="w-3 h-3 text-gold-700" />
                Audited Knowledge Base
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Directly grounded in authenticated enterprise documents, covenants, and operating policies.
            </p>
          </div>
        </div>

        {/* Filter and Clear Chat */}
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium">
            <Filter className="w-3.5 h-3.5 text-gold-700" />
            <span className="text-[11px] font-semibold text-slate-700">Filter Dept:</span>
            <select
              value={departmentContext}
              onChange={(e) => setDepartmentContext(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs bg-white text-slate-800 border border-gold-300/80 font-medium focus:outline-none focus:border-gold-500 shadow-2xs cursor-pointer"
            >
              <option value="All Departments">All Departments (Entire Enterprise)</option>
              <option value="Legal & Compliance">Legal & Compliance</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance & Accounting">Finance & Accounting</option>
              <option value="Operations & Supply Chain">Operations & Supply Chain</option>
            </select>
          </div>

          <button
            onClick={clearChat}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-[#FCFBF8] to-white">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs border ${
                  isUser
                    ? "bg-gradient-to-br from-gold-600 to-amber-700 text-white border-gold-400 shadow-goldSoft"
                    : "bg-white text-gold-800 border-gold-300 shadow-luxuryCard"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-gold-700" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 border transition-all ${
                  isUser
                    ? "bg-gradient-to-r from-gold-600 to-amber-700 text-white border-gold-400 rounded-tr-none shadow-goldSoft"
                    : "bg-white text-slate-800 border-gold-300/70 rounded-tl-none shadow-luxuryCard hover:border-gold-400"
                }`}
              >
                <div className={isUser ? "text-white" : "text-slate-800"}>
                  {renderFormattedText(msg.text)}
                </div>

                {/* Citations Box */}
                {!isUser && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gold-200/60">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gold-900 mb-1.5 flex items-center gap-1 font-serif">
                      <BookOpen className="w-3 h-3 text-gold-700" />
                      Grounded Citations ({msg.citations.length} Verified Sources)
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cite) => (
                        <button
                          key={cite.id}
                          onClick={() => setActiveCitation(cite)}
                          className="px-2.5 py-1 rounded-lg bg-gold-50/90 hover:bg-gold-100 text-gold-900 border border-gold-300 text-[10px] font-semibold flex items-center gap-1 transition-all shadow-xs"
                        >
                          <span className="truncate max-w-[150px] font-serif-luxury">{cite.title}</span>
                          <span className="text-[8px] uppercase font-mono px-1 rounded bg-gold-200/70 text-gold-950 font-bold">
                            {cite.classification}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta footer */}
                <div className={`flex items-center justify-between text-[9px] pt-1 ${isUser ? "text-amber-100" : "text-slate-400"}`}>
                  <span>{msg.timestamp}</span>
                  {!isUser && msg.latencyMs && (
                    <span className="flex items-center gap-1 font-mono text-gold-800 font-semibold">
                      <Clock className="w-2.5 h-2.5" />
                      {msg.latencyMs}ms ({msg.modelUsed || "gemini-3.8-flash"})
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
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-gold-700 border border-gold-300 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-gold-300/70 shadow-luxuryCard flex items-center space-x-2 text-xs text-gold-900">
              <div className="w-2 h-2 rounded-full bg-gold-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-gold-500 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-gold-500 animate-bounce [animation-delay:0.4s]"></div>
              <span className="text-[11px] text-slate-600 ml-2 font-medium">Retrieving sovereign documents & synthesizing with Gemini 3.8 Flash...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-4 py-2.5 border-t border-gold-200/50 bg-[#FAF8F5] flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-900 shrink-0 font-serif">
          Suggested Inquiries:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1 rounded-full bg-white hover:bg-gold-50 text-slate-700 hover:text-gold-950 border border-gold-300/60 text-[10px] whitespace-nowrap transition-all shadow-2xs font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-gold-300/50 bg-white shrink-0">
        <div className="relative flex items-center">
          <textarea
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Query Sovereign Copilot across ${departmentContext.toLowerCase()} policies, MSAs, and covenants... (Enter to send)`}
            className="glass-input w-full pl-4 pr-12 py-3 rounded-2xl text-xs resize-none leading-relaxed"
          ></textarea>
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2.5 p-2 rounded-xl gold-foil-btn disabled:opacity-40 text-white shadow-goldSoft transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Citation Detail Modal */}
      {activeCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 relative border border-gold-300 shadow-2xl">
            <h4 className="text-base font-bold text-slate-900 font-serif-luxury mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gold-700" />
              {activeCitation.title}
            </h4>
            <div className="flex items-center gap-2 mb-3 text-[11px] text-slate-500">
              <span>Jurisdiction / Dept: <strong className="text-slate-800">{activeCitation.departmentTag || "General"}</strong></span>
              <span>•</span>
              <span className="font-mono uppercase font-bold text-gold-900 px-1.5 py-0.5 rounded bg-gold-100 border border-gold-300">
                {activeCitation.classification}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FCFBF8] font-mono text-xs text-slate-800 leading-relaxed border border-gold-200 max-h-60 overflow-y-auto mb-5 shadow-inner">
              "{activeCitation.snippet}"
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveCitation(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold gold-foil-btn text-white shadow-goldSoft transition-all"
              >
                Dismiss Citation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
