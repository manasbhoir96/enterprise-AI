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
  Cpu,
  Layers,
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
    if (!confirm("Are you sure you want to remove this vector document from the knowledge base?")) return;
    try {
      await apiRequest(`/knowledge/${id}`, { method: "DELETE" });
      setAssets((prev) => prev.filter((a) => a.id !== id));
      if (previewAsset?.id === id) setPreviewAsset(null);
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl glass-panel relative overflow-hidden border border-[#00E5FF]/25 shadow-[0_0_35px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-4">
        {/* Laser Scanning overlay */}
        <div className="absolute inset-0 hologram-laser-sweep pointer-events-none" />

        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FFA3] animate-pulse" />
            <span className="text-[10px] font-quant font-bold text-[#00FFA3] tracking-widest uppercase bg-[#00FFA3]/10 px-2.5 py-0.5 rounded-md border border-[#00FFA3]/30">
              VECTOR EMBEDDINGS ACTIVE
            </span>
            <span className="text-[10px] font-quant text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              AES-256 ENCRYPTED
            </span>
          </div>
          <h1 className="text-2xl font-bold font-quant text-white tracking-tight">
            RAG Knowledge Vault & Vector Index
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Tenant-isolated institutional knowledge base powering zero-hallucination Copilot reasoning.
          </p>
        </div>

        <button
          onClick={() => setShowUploader(!showUploader)}
          className="bull-market-btn px-4 py-2.5 rounded-xl text-xs font-quant font-bold transition-all flex items-center gap-1.5 z-10 hover:scale-105"
        >
          <Plus className="w-4 h-4 text-[#050811]" />
          <span>Deposit Vector Document</span>
        </button>
      </div>

      {/* Ingestion Uploader Dropdown Modal */}
      {showUploader && (
        <KnowledgeUploader
          onClose={() => setShowUploader(false)}
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-quant font-semibold whitespace-nowrap transition-all border ${
                selectedDept === dept
                  ? "bg-[#00FFA3] text-[#050811] border-[#00FFA3] font-bold shadow-[0_0_12px_rgba(0,255,163,0.35)]"
                  : "bg-black/40 text-slate-400 border-white/10 hover:bg-black/60 hover:text-white hover:border-[#00E5FF]/40"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-[#00E5FF] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vault clauses or covenants..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs font-quant glass-input placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs font-quant text-[#00FFA3]">
          Retrieving vault documents & cryptographic certificates...
        </div>
      ) : assets.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-dashed border-[#00E5FF]/30 space-y-3">
          <BookOpen className="w-8 h-8 text-[#00E5FF] mx-auto" />
          <h3 className="text-sm font-bold font-quant text-white">No vault records found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Deposit organizational policies, vendor MSAs, or compliance audits to index into the Quantis Copilot.
          </p>
          <button
            onClick={() => setShowUploader(true)}
            className="px-5 py-2.5 rounded-xl bull-market-btn text-[#050811] text-xs font-quant font-bold"
          >
            Deposit First Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setPreviewAsset(asset)}
              className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-[#00E5FF]/50 hover:shadow-[0_0_25px_rgba(0,229,255,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 group-hover:bg-[#00FFA3]/10 group-hover:text-[#00FFA3] group-hover:border-[#00FFA3]/40 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-quant font-bold px-2 py-0.5 rounded-full bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/30">
                      {asset.department_tag || "Enterprise"}
                    </span>
                    <button
                      onClick={(e) => handleDelete(asset.id, e)}
                      className="p-1 rounded-lg text-slate-500 hover:text-[#FF3366] hover:bg-[#FF3366]/10 transition-colors"
                      title="Purge Vector Chunk"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#00E5FF] transition-colors line-clamp-1 mb-1">
                  {asset.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {asset.summary || asset.content_text.slice(0, 160)}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-[11px] font-quant text-slate-400">
                <span className="text-[#00E5FF] font-semibold">{Math.max(1, Math.ceil(asset.content_text.length / 400))} vectors</span>
                <span>{new Date(asset.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Inspector Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel border border-[#00E5FF]/40 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-[0_0_50px_rgba(0,229,255,0.3)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#00FFA3]" />
                <h3 className="text-sm font-bold font-quant text-white">Vector Ingestion Record</h3>
              </div>
              <button
                onClick={() => setPreviewAsset(null)}
                className="text-slate-400 hover:text-white text-xs font-quant p-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#00E5FF] font-quant">{previewAsset.title}</h4>
              <div className="flex items-center gap-3 text-xs font-quant text-slate-400">
                <span>Department: {previewAsset.department_tag || "General"}</span>
                <span>•</span>
                <span>Security: {previewAsset.classification}</span>
                <span>•</span>
                <span>Vectors: {Math.max(1, Math.ceil(previewAsset.content_text.length / 400))}</span>
              </div>
              <div className="p-4 bg-black/60 rounded-xl border border-white/10 text-xs font-mono text-slate-200 leading-relaxed max-h-72 overflow-y-auto">
                {previewAsset.content_text}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-quant text-slate-400">
              <span>Tenant Partition: Isolated</span>
              <button
                onClick={() => setPreviewAsset(null)}
                className="bull-market-btn px-4 py-1.5 rounded-lg text-[#050811] font-bold text-xs"
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
