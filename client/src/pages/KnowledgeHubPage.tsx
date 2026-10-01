import React, { useState, useEffect } from "react";
import {
  Database,
  Plus,
  Search,
  Filter,
  FileText,
  Trash2,
  ExternalLink,
  Shield,
  Eye,
  X,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { KnowledgeUploader } from "../components/knowledge/KnowledgeUploader.js";
import { apiRequest } from "../lib/api.js";
import type { KnowledgeAsset } from "@nexusai/shared";

export const KnowledgeHubPage: React.FC = () => {
  const [assets, setAssets] = useState<KnowledgeAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploader, setShowUploader] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<KnowledgeAsset | null>(null);

  const departments = [
    "All",
    "Legal & Compliance",
    "Human Resources",
    "Finance & Accounting",
    "Operations & Supply Chain",
    "Executive Leadership",
  ];

  const loadAssets = async () => {
    try {
      let url = "/knowledge";
      const params = new URLSearchParams();
      if (selectedDept !== "All") params.append("department", selectedDept);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      if (params.toString()) url += `?${params.toString()}`;

      const res = await apiRequest<{ assets: KnowledgeAsset[] }>(url);
      setAssets(res.assets);
    } catch (err) {
      console.error("Failed to load knowledge assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [selectedDept, searchQuery]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to remove this document from the enterprise RAG index?")) {
      return;
    }

    try {
      await apiRequest(`/knowledge/${id}`, { method: "DELETE" });
      setAssets((prev) => prev.filter((a) => a.id !== id));
      if (previewAsset?.id === id) setPreviewAsset(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete asset");
    }
  };

  const getClassificationBadge = (classification: string) => {
    switch (classification) {
      case "restricted":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">RESTRICTED</span>;
      case "confidential":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">CONFIDENTIAL</span>;
      case "public":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">PUBLIC</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">INTERNAL</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 border border-indigo-500/20 shadow-glow">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            Company Document Library
          </h2>
          <p className="text-xs text-slate-300">
            Store and organize handbooks, agreements, and policies so your AI copilot can reference them anytime.
          </p>
        </div>

        <button
          onClick={() => setShowUploader(!showUploader)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-glow transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          {showUploader ? "Close Upload Box" : "+ Upload New Document"}
        </button>
      </div>

      {/* Uploader Section */}
      {showUploader && (
        <KnowledgeUploader
          onSuccess={() => {
            loadAssets();
            setShowUploader(false);
          }}
        />
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Department Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedDept === dept
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                  : "bg-white/[0.02] text-slate-400 border-white/5 hover:bg-white/[0.05] hover:text-slate-200"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents or clauses..."
            className="glass-input w-full pl-9 pr-3.5 py-2 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">
          Loading enterprise documents...
        </div>
      ) : assets.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border-dashed border-white/10 space-y-3">
          <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No documents found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Upload organizational policies or sample agreements to ground the AI Copilot.
          </p>
          <button
            onClick={() => setShowUploader(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow"
          >
            Ingest First Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setPreviewAsset(asset)}
              className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                    <FileText className="w-4 h-4" />
                  </div>
                  {getClassificationBadge(asset.classification)}
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
                  {asset.title}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mb-3">
                  Dept: {asset.department_tag || "General Corporate"}
                </p>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {asset.content_text}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span>By {asset.uploader_name || "Admin"}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleDelete(asset.id, e)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Asset Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-3xl rounded-2xl p-6 relative border border-white/10 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-white/5 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-white">{previewAsset.title}</h3>
                  {getClassificationBadge(previewAsset.classification)}
                </div>
                <p className="text-xs text-slate-400">
                  Target Department: <span className="text-slate-200">{previewAsset.department_tag || "General"}</span> • Ingested on {new Date(previewAsset.created_at).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => setPreviewAsset(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300">
                <span className="font-bold flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  AI RAG Vector Index Status: Active
                </span>
                This asset is indexed for zero-shot retrieval by the Enterprise Copilot and automated workflow agents.
              </div>

              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Full Document Text
                </h4>
                <div className="p-4 rounded-xl bg-nexus-950 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed border border-white/5 max-h-96 overflow-y-auto">
                  {previewAsset.content_text}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-end mt-4">
              <button
                onClick={() => setPreviewAsset(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
