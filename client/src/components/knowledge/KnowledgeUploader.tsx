import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, BookOpen, Shield } from "lucide-react";
import { apiRequest } from "../../lib/api.js";
import type { IngestKnowledgeInput, DataClassification } from "@nexusai/shared";

interface KnowledgeUploaderProps {
  onSuccess: () => void;
}

export const KnowledgeUploader: React.FC<KnowledgeUploaderProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState("");
  const [departmentTag, setDepartmentTag] = useState("Legal & Compliance");
  const [classification, setClassification] = useState<DataClassification>("internal");
  const [contentText, setContentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const sampleTemplates = [
    {
      label: "Vendor SLA & Indemnity Clause",
      dept: "Legal & Compliance",
      classification: "confidential" as DataClassification,
      title: "Vendor Enterprise Cloud SLA & Indemnity Agreement",
      text: `VENDOR ENTERPRISE SERVICE LEVEL & INDEMNIFICATION AGREEMENT

1. UPTIME COMMITMENT: Vendor guarantees a Monthly Uptime Percentage of at least 99.9% during each calendar billing cycle. If uptime falls below 99.9%, Customer is entitled to a service credit of 15% of the monthly fee; if below 98.5%, credit is 35%.

2. INDEMNIFICATION OBLIGATIONS: Vendor shall indemnify, defend, and hold harmless Customer and its directors, employees, and agents from any and all third-party claims, liabilities, damages, and costs arising out of:
(a) Infringement of any intellectual property right, patent, or trade secret;
(b) Breach of data confidentiality or unauthorized access to Customer Personal Data;
(c) Gross negligence or willful misconduct of Vendor personnel.

3. LIMITATION OF LIABILITY: Each party's total aggregate liability under this agreement shall not exceed 1.5x the total fees paid in the prior twelve months, except in cases of confidentiality breach or gross negligence where liability remains uncapped.`,
    },
    {
      label: "HR Benefits & Travel Policy",
      dept: "Human Resources",
      classification: "internal" as DataClassification,
      title: "Corporate Travel Reimbursement & Per Diem Policy",
      text: `ENTERPRISE TRAVEL & PER DIEM POLICY MANUAL

1. SCOPE: This policy applies to all global full-time employees incurring business-related travel expenses on behalf of the corporation.

2. AIR TRAVEL STANDARDS: Standard travel is economy class for domestic flights under 5 hours. Business class booking is permitted only for international flights exceeding 6 continuous hours with prior written authorization from the department Vice President.

3. LODGING & MEALS: Maximum reimbursable lodging rate is $250/night for Tier 1 metropolitan areas (NYC, SF, London) and $180/night for Tier 2 areas. Daily meal allowance is capped at $75/day ($20 breakfast, $25 lunch, $30 dinner). Itemized receipts must be uploaded to the portal within 30 days of travel completion.`,
    },
    {
      label: "Security Incident Response Runbook",
      dept: "Operations & Supply Chain",
      classification: "restricted" as DataClassification,
      title: "Cloud Infrastructure SOC2 Incident Response Policy",
      text: `INFRASTRUCTURE SECURITY & INCIDENT ESCALATION RUNBOOK

1. CLASSIFICATION OF INCIDENTS:
- P1 (Critical): Active unauthorized data exfiltration, database ransomware, or total service disruption affecting >20% of enterprise customers. Incident Commander mobilized in 15 minutes.
- P2 (High): Elevated vulnerability in customer-facing APIs without confirmed exploitation. Response in 2 hours.

2. LOG RETENTION & ENCRYPTION:
All telemetry, audit trails, and access logs must be retained in immutable WORM storage for a minimum of 365 days. Data at rest must be encrypted using AES-256-GCM. Data in transit must strictly enforce TLS 1.3 with forward secrecy.`,
    },
  ];

  const handleApplyTemplate = (tmpl: typeof sampleTemplates[0]) => {
    setTitle(tmpl.title);
    setDepartmentTag(tmpl.dept);
    setClassification(tmpl.classification);
    setContentText(tmpl.text);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setContentText(content || "");
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (contentText.length < 50) {
      setError("Document text must be at least 50 characters to enable AI RAG processing.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: IngestKnowledgeInput = {
        title,
        contentText,
        departmentTag,
        classification,
      };

      await apiRequest("/knowledge/ingest", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccessMsg("Document ingested and indexed into Enterprise RAG pipeline!");
      setTitle("");
      setContentText("");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to ingest document");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl relative border border-indigo-500/30 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-indigo-400" />
            Upload a Company Document
          </h3>
          <p className="text-xs text-slate-300">
            Add company policies, handbooks, or vendor contracts so your AI copilot can learn them.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold">💡 Try a Sample Document:</span>
          {sampleTemplates.map((t, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleApplyTemplate(t)}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold transition-all"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Document Name / Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Remote Work Policy (2025)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Department
            </label>
            <select
              value={departmentTag}
              onChange={(e) => setDepartmentTag(e.target.value)}
              className="glass-input w-full px-3 py-2.5 rounded-xl text-xs bg-nexus-900"
            >
              <option value="Legal & Compliance">Legal & Compliance</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance & Accounting">Finance & Accounting</option>
              <option value="Operations & Supply Chain">Operations & Supply Chain</option>
              <option value="Sales & Customer Success">Sales & Customer Success</option>
              <option value="Executive Leadership">Executive Leadership</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Privacy / Access Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["public", "internal", "confidential", "restricted"] as DataClassification[]).map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setClassification(level)}
                  className={`py-2 px-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all border ${
                    classification === level
                      ? level === "restricted"
                        ? "bg-rose-500/25 text-rose-200 border-rose-500 shadow-md shadow-rose-500/20"
                        : level === "confidential"
                        ? "bg-amber-500/25 text-amber-200 border-amber-500 shadow-md shadow-amber-500/20"
                        : "bg-indigo-600/30 text-indigo-200 border-indigo-400 shadow-md shadow-indigo-500/20"
                      : "bg-white/[0.03] text-slate-400 border-white/5 hover:bg-white/[0.07]"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Or Choose a File from Your Computer (.txt, .md)
            </label>
            <input
              type="file"
              accept=".txt,.md,.json,.pdf,.doc"
              onChange={handleFileUpload}
              className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600/20 file:text-indigo-300 hover:file:bg-indigo-600/30 file:cursor-pointer cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Document Content (Type or paste the text here)
          </label>
          <textarea
            rows={5}
            required
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            placeholder="Paste contract terms, internal policy clauses, employee handbook text, or vendor SLAs..."
            className="glass-input w-full p-3 rounded-xl text-xs font-mono leading-relaxed"
          ></textarea>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <Shield className="w-4 h-4" />
            <span>🔒 Encrypted and private to your company</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-glow transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving & Indexing Document...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Save & Index Document
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
