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
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-300 font-mono">RESTRICTED</span>;
      case "confidential":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300 font-mono">CONFIDENTIAL</span>;
      case "public":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-300 font-mono">PUBLIC</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-50 text-gold-900 border border-gold-300 font-mono">INTERNAL</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white border border-gold-300/80 shadow-luxuryCard flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-serif-luxury tracking-wide flex items-center gap-2">
            <Database className="w-5 h-5 text-gold-700" />
            Institutional Document Vault
          </h2>
          <p className="text-xs text-slate-500">
            Secure multi-tenant repository for Master Services Agreements, compliance handbooks, and fiduciary disclosures.
          </p>
        </div>

        <button
          onClick={() => setShowUploader(!showUploader)}
          className="px-5 py-2.5 rounded-xl gold-foil-btn text-white font-bold text-xs shadow-goldSoft transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          {showUploader ? "Collapse Ingestion Box" : "+ Deposit New Document"}
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedDept === dept
                  ? "bg-gradient-to-r from-gold-600 to-amber-700 text-white border-gold-400 shadow-goldSoft"
                  : "bg-white text-slate-700 border-gold-200/80 hover:bg-gold-50 hover:text-slate-900 hover:border-gold-300"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-gold-700 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vault clauses or covenants..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-white text-slate-800 border border-gold-300/80 focus:outline-none focus:border-gold-500 shadow-2xs placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gold-800 font-medium">
          Retrieving vault documents & cryptographic certificates...
        </div>
      ) : assets.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-gold-300 space-y-3 shadow-luxuryCard">
          <BookOpen className="w-8 h-8 text-gold-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 font-serif-luxury">No vault records found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Deposit organizational policies, vendor MSAs, or compliance audits to index into the Enterprise Copilot.
          </p>
          <button
            onClick={() => setShowUploader(true)}
            className="px-5 py-2.5 rounded-xl gold-foil-btn text-white text-xs font-semibold shadow-goldSoft"
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
              className="gold-card-sheen p-5 rounded-2xl bg-white border border-gold-300/70 hover:border-gold-500 hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300 shadow-luxuryCard cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gold-50 text-gold-800 flex items-center justify-center shrink-0 border border-gold-300 shadow-2xs group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  {getClassificationBadge(asset.classification)}
                </div>

                <h3 className="text-sm font-bold text-slate-900 font-serif-luxury group-hover:text-gold-900 transition-colors line-clamp-1 mb-1">
                  {asset.title}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono mb-3">
                  Jurisdiction: <span className="text-slate-800 font-semibold">{asset.department_tag || "General Corporate"}</span>
                </p>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {asset.content_text}
                </p>
              </div>

              <div className="pt-3 border-t border-gold-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>By <strong className="text-slate-700">{asset.uploader_name || "Admin"}</strong></span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleDelete(asset.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-gold-700 font-bold group-hover:translate-x-1 transition-transform">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl p-6 relative border border-gold-300 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-gold-200/80 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-slate-900 font-serif-luxury">{previewAsset.title}</h3>
                  {getClassificationBadge(previewAsset.classification)}
                </div>
                <p className="text-xs text-slate-500">
                  Target Department: <span className="text-slate-800 font-semibold">{previewAsset.department_tag || "General"}</span> • Deposited on {new Date(previewAsset.created_at).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => setPreviewAsset(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-gold-50 border border-transparent hover:border-gold-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="p-3.5 rounded-2xl bg-gold-50/70 border border-gold-200 text-xs text-gold-950">
                <span className="font-bold flex items-center gap-1.5 mb-1 font-serif text-gold-900">
                  <Sparkles className="w-3.5 h-3.5 text-gold-700" />
                  Zero-Shot Vector Index: Active & Authenticated
                </span>
                This asset is indexed for real-time citation synthesis by the Sovereign Copilot and automated covenant audit workflows.
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-serif">
                  Document Text Record
                </h4>
                <div className="p-4 rounded-2xl bg-[#FCFBF8] font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed border border-gold-200 max-h-96 overflow-y-auto shadow-inner">
                  {previewAsset.content_text}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gold-200/80 flex items-center justify-end mt-4">
              <button
                onClick={() => setPreviewAsset(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold gold-foil-btn text-white shadow-goldSoft transition-all"
              >
                Close Vault Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
