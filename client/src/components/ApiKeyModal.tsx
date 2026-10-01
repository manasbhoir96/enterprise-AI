import React, { useState } from "react";
import { KeyRound, X, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.js";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { customApiKey, setCustomApiKey } = useAuth();
  const [inputKey, setInputKey] = useState(customApiKey || "");
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setCustomApiKey(inputKey.trim() || null);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setInputKey("");
    setCustomApiKey(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 relative border border-indigo-500/30 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Gemini 2.5 Flash Engine Configuration
            </h2>
            <p className="text-xs text-slate-400">
              NexusAI uses the official <span className="text-indigo-400">@google/genai</span> SDK.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Zero-Friction Hackathon Mode
            </div>
            <p className="text-slate-400 leading-relaxed">
              If no API key is specified, NexusAI automatically utilizes its high-fidelity deterministic enterprise RAG pipeline so all routes and schemas execute without errors.
            </p>
            <p className="text-slate-400 leading-relaxed">
              To direct requests to your live Google Gemini instance, paste your Gemini API key below.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-mono placeholder:text-slate-600 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
            >
              Reset to Server Default
            </button>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all flex items-center gap-1.5"
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    Saved!
                  </>
                ) : (
                  <>Save Configuration</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
