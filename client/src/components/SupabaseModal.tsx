import React, { useState, useEffect } from "react";
import { Database, CheckCircle2, AlertCircle, X, ExternalLink, Sparkles, RefreshCw, Server, ArrowRight } from "lucide-react";
import { apiRequest } from "../lib/api.js";

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [connString, setConnString] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [migrateResult, setMigrateResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    async function loadStatus() {
      try {
        const res = await apiRequest("/org/database-status");
        setDbStatus(res.status);
      } catch (e) {
        console.error("Failed to load DB status:", e);
      }
    }
    loadStatus();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!connString.trim()) {
      setTestResult({ success: false, message: "Please enter your Supabase connection string." });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await apiRequest("/org/test-database", {
        method: "POST",
        body: JSON.stringify({ connectionString: connString.trim() }),
      });
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || "Connection failed." });
    } finally {
      setIsTesting(false);
    }
  };

  const handleMigrate = async () => {
    if (!connString.trim()) {
      setMigrateResult({ success: false, message: "Please enter your Supabase connection string." });
      return;
    }
    setIsMigrating(true);
    setMigrateResult(null);
    try {
      const res = await apiRequest("/org/migrate-database", {
        method: "POST",
        body: JSON.stringify({ connectionString: connString.trim() }),
      });
      setMigrateResult(res);
    } catch (err: any) {
      setMigrateResult({ success: false, message: err.message || "Migration failed." });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-7 relative border border-emerald-500/30 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              Supabase Cloud Database
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                POSTGRESQL 16
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Connect your cloud Supabase database for persistent production storage.
            </p>
          </div>
        </div>

        {/* Current Active DB Status */}
        <div className="p-4 rounded-2xl bg-nexus-900/80 border border-white/5 space-y-2 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Database Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {dbStatus?.provider || "PostgreSQL Ready"}
            </span>
          </div>
          <p className="text-xs font-mono text-slate-300 truncate">
            {dbStatus?.databaseUrlMasked || "postgresql://localhost:5432/nexusai_db"}
          </p>
          <p className="text-[11px] text-slate-400">
            SSL Encryption: <strong className="text-slate-300">{dbStatus?.sslEnabled ? "Enabled (TLS 1.3)" : "Automatic when Supabase host detected"}</strong>
          </p>
        </div>

        {/* Step-by-Step Supabase Guide */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2 text-xs text-slate-300">
            <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              How to Connect Supabase in 2 Steps:
            </h4>
            <ol className="list-decimal ml-4 space-y-1 text-slate-400 leading-relaxed text-[11px]">
              <li>
                In your Supabase project dashboard, click <strong>Project Settings → Database</strong>.
              </li>
              <li>
                Scroll to <strong>Connection String</strong>, select <strong>URI</strong>, copy it, and paste below.
              </li>
            </ol>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold underline pt-1"
            >
              Open Supabase Dashboard <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Supabase Connection String (URI)
            </label>
            <input
              type="password"
              value={connString}
              onChange={(e) => setConnString(e.target.value)}
              placeholder="postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres"
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-mono placeholder:text-slate-600"
            />
          </div>

          {/* Test & Migrate Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Server className="w-3.5 h-3.5 text-emerald-400" />}
              Test Connection
            </button>

            <button
              type="button"
              onClick={handleMigrate}
              disabled={isMigrating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isMigrating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
              Apply Supabase Schema
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testResult.success
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {testResult.message}
            </div>
          )}

          {migrateResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                migrateResult.success
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              {migrateResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {migrateResult.message}
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
