import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import { EnterpriseSidebar } from "./components/EnterpriseSidebar.js";
import { ApiKeyModal } from "./components/ApiKeyModal.js";
import { LoginPage } from "./pages/LoginPage.js";
import { ExecutiveDashboard } from "./pages/ExecutiveDashboard.js";
import { CopilotPage } from "./pages/CopilotPage.js";
import { KnowledgeHubPage } from "./pages/KnowledgeHubPage.js";
import { WorkflowManagerPage } from "./pages/WorkflowManagerPage.js";
import { TenantAdminPage } from "./pages/TenantAdminPage.js";
import { Building2, KeyRound, Sparkles } from "lucide-react";

function AppContent() {
  const { user, organization, isLoading, customApiKey } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname;
    return p === "/" ? "/dashboard" : p;
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

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
          Initializing NexusAI Enterprise Tenant Space...
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
        return <TenantAdminPage onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)} />;
      default:
        return <ExecutiveDashboard onNavigate={navigate} />;
    }
  };

  const getPageTitle = () => {
    switch (currentPath) {
      case "/dashboard":
        return "Executive Overview & Telemetry";
      case "/copilot":
        return "Context-Aware Enterprise Copilot";
      case "/knowledge-base":
        return "Enterprise Document Hub & RAG Vector Store";
      case "/workflows":
        return "Agentic Automation Engine & Audit Trail";
      case "/settings/org":
        return "Tenant Administration & RBAC";
      default:
        return "Executive Overview";
    }
  };

  return (
    <div className="min-h-screen bg-nexus-950 flex">
      {/* Sidebar Navigation */}
      <EnterpriseSidebar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Enterprise Bar */}
        <header className="h-16 border-b border-white/5 bg-nexus-900/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <h2 className="text-sm font-extrabold text-white tracking-tight">
              {getPageTitle()}
            </h2>
            <span className="hidden md:inline-flex text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              TENANT: {organization?.name || "Acme Corp"}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] font-mono">Gemini 2.5 Flash</span>
            </div>

            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                customApiKey
                  ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/30"
                  : "bg-white/5 text-slate-400 hover:text-white border-white/10 hover:bg-white/10"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{customApiKey ? "API Key Active" : "Config Key"}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page View */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Global API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
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
