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
import { Share2, Sparkles } from "lucide-react";

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
      <div className="min-h-screen bg-nexus-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-mono tracking-wider">
          Starting NexusAI Workspace...
        </p>
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
        return "Company Overview & Telemetry";
      case "/copilot":
        return "Company AI Copilot";
      case "/knowledge-base":
        return "Document Library & Knowledge Hub";
      case "/workflows":
        return "Smart Workflows & Review Engine";
      case "/settings/org":
        return "Company Settings & Team Directory";
      default:
        return "Company Overview";
    }
  };

  return (
    <div className="min-h-screen bg-nexus-950 flex selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sidebar Navigation */}
      <EnterpriseSidebar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/5 bg-nexus-900/50 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              {getPageTitle()}
            </h2>
            <span className="hidden md:inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              🏢 {organization?.name || "Acme Corporation"}
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* AI Active Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Gemini 3.8 Flash AI Active</span>
            </div>

            {/* Share Public Link Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyanGlow transition-all flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share App (Public Link)</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page View */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {renderCurrentPage()}
        </main>
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
