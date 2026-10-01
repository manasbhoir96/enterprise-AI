import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import { EnterpriseSidebar } from "./components/EnterpriseSidebar.js";
import { ShareModal } from "./components/ShareModal.js";
import { LoginPage } from "./pages/LoginPage.js";
import { ExecutiveDashboard } from "./pages/ExecutiveDashboard.js";
import { CopilotPage } from "./pages/CopilotPage.js";
import { KnowledgeHubPage } from "./pages/KnowledgeHubPage.js";
import { WorkflowManagerPage } from "./pages/WorkflowManagerPage.js";
import { TenantAdminPage } from "./pages/TenantAdminPage.js";
import { LiveFinancialTickertape } from "./components/dashboard/LiveFinancialTickertape.js";
import { Share2, Sparkles, Cpu, Activity, ShieldCheck } from "lucide-react";

function AppContent() {
  const { user, organization, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname;
    return p === "/" ? "/dashboard" : p;
  });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      setCurrentPath(p === "/" ? "/dashboard" : p);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center space-y-6 text-center select-none">
        <div className="relative">
          <div className="w-16 h-16 rounded-full ai-thinking-orb flex items-center justify-center shadow-[0_0_40px_rgba(0,255,163,0.5)]">
            <Cpu className="w-8 h-8 text-[#050811] animate-pulse" />
          </div>
          <div className="absolute -inset-3 rounded-full border border-dashed border-[#00E5FF]/40 animate-spin" style={{ animationDuration: "10s" }} />
        </div>
        <div>
          <p className="text-sm font-quant font-bold text-white tracking-wider">
            INITIALIZING QUANTIS HOLOGRAPHIC OPERATIONAL LAYER
          </p>
          <p className="text-xs font-quant text-slate-400 mt-1">
            Grounding RAG Vector Index & Secure Tenant Memory...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onSuccess={() => navigate("/dashboard")} />;
  }

  const renderCurrentPage = () => {
    switch (currentPath) {
      case "/dashboard":
        return <ExecutiveDashboard onNavigate={navigate} />;
      case "/copilot":
        return <CopilotPage />;
      case "/knowledge-base":
        return <KnowledgeHubPage />;
      case "/workflows":
        return <WorkflowManagerPage />;
      case "/settings/org":
        return <TenantAdminPage />;
      default:
        return <ExecutiveDashboard onNavigate={navigate} />;
    }
  };

  const getPageTitle = () => {
    switch (currentPath) {
      case "/dashboard":
        return "Executive Treasury & Alpha Dashboard";
      case "/copilot":
        return "Quantis Holographic AI Copilot";
      case "/knowledge-base":
        return "RAG Knowledge Vault & Vector Index";
      case "/workflows":
        return "Autonomous Workflows & Risk Audit";
      case "/settings/org":
        return "Institutional Governance & Officers";
      default:
        return "Executive Overview";
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col selection:bg-[#00FFA3]/30 selection:text-[#00FFA3]">
      {/* Real-time Constantly Scrolling Financial & AI Tickertape */}
      <LiveFinancialTickertape />

      <div className="flex-1 flex min-h-0">
        {/* Sidebar Navigation */}
        <EnterpriseSidebar
          currentPath={currentPath}
          onNavigate={navigate}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />

        {/* Main Workspace Canvas */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-b from-[#0B0F19] via-[#080C14] to-[#050811]">
          {/* Top Header Bar */}
          <header className="h-16 border-b border-gold-500/20 bg-[#050811]/90 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-20 shadow-md">
            <div className="flex items-center space-x-3.5">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>{getPageTitle()}</span>
              </h2>
              <span className="hidden md:inline-flex text-[11px] font-quant font-semibold px-2.5 py-0.5 rounded-full bg-black/60 text-[#D4AF37] border border-gold-500/30">
                🏢 {organization?.name || "Acme Global Treasury"}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {/* AI Engine Status Chip */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 border border-gold-500/30 text-white text-xs font-quant shadow-[0_0_10px_rgba(212,175,55,0.15)]">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[#D4AF37] font-bold">RAG ACTIVE</span>
                <span className="text-slate-300">| Gemini 2.5</span>
              </div>

              {/* Share Public Link Button */}
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="gold-foil-btn px-4 py-2 rounded-xl text-xs font-quant font-bold transition-all flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-white" />
                <span>Share Terminal</span>
              </button>
            </div>
          </header>

          {/* Dynamic Page View */}
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
            {renderCurrentPage()}
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
