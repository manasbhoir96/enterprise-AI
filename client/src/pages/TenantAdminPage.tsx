import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Building2,
  Users,
  UserPlus,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  Database,
  Cpu,
  Sparkles,
} from "lucide-react";
import { apiRequest } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.js";
import type { User, InviteMemberInput } from "@nexusai/shared";

interface TenantAdminPageProps {
  onOpenApiKeyModal: () => void;
}

export const TenantAdminPage: React.FC<TenantAdminPageProps> = ({ onOpenApiKeyModal }) => {
  const { user, organization, customApiKey } = useAuth();
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteDept, setInviteDept] = useState("Legal & Compliance");
  const [inviteRole, setInviteRole] = useState<"admin" | "employee">("employee");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  // Settings form
  const [orgName, setOrgName] = useState(organization?.name || "");
  const [orgIndustry, setOrgIndustry] = useState(organization?.industry || "");
  const [complianceLevel, setComplianceLevel] = useState("SOC2 Type II & HIPAA");
  const [settingsSaved, setSettingsSaved] = useState(false);

  const loadMembers = async () => {
    try {
      const res = await apiRequest<{ members: User[] }>("/org/members");
      setMembers(res.members);
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    setInviteSuccess(null);

    try {
      const payload: InviteMemberInput = {
        email: inviteEmail,
        fullName: inviteName,
        department: inviteDept,
        role: inviteRole,
      };

      await apiRequest("/org/members", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setInviteSuccess(`Successfully onboarded ${inviteName} (${inviteEmail})!`);
      setInviteEmail("");
      setInviteName("");
      loadMembers();
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteSuccess(null);
      }, 1200);
    } catch (err: any) {
      alert(err.message || "Failed to onboard employee");
    } finally {
      setIsInviting(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/org/settings", {
        method: "PATCH",
        body: JSON.stringify({
          name: orgName,
          industry: orgIndustry,
          complianceLevel,
        }),
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
    } catch (err: any) {
      alert(err.message || "Failed to update tenant settings");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">OWNER</span>;
      case "admin":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">ADMIN</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-500/20 text-slate-300 border border-slate-500/40">EMPLOYEE</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            Enterprise Tenant Administration & Governance
          </h2>
          <p className="text-xs text-slate-400">
            Manage organization telemetry, Role-Based Access Control (RBAC), and security compliance.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow transition-all flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" />
          Onboard Employee
        </button>
      </div>

      {/* Grid: Tenant Telemetry + AI Governance Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Organization Telemetry Form */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              Organization Profile & Telemetry
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Tenant ID: {organization?.id.substring(0, 8)}...
            </span>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Organization Legal Entity
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Industry Sector
              </label>
              <input
                type="text"
                value={orgIndustry}
                onChange={(e) => setOrgIndustry(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Compliance & Regulatory Baseline
              </label>
              <select
                value={complianceLevel}
                onChange={(e) => setComplianceLevel(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-xl text-xs bg-nexus-900"
              >
                <option value="SOC2 Type II & HIPAA">SOC2 Type II & HIPAA (Healthcare/Cloud)</option>
                <option value="SOC2 Type II & ISO 27001">SOC2 Type II & ISO 27001 (Enterprise SaaS)</option>
                <option value="PCI-DSS Level 1 & SOC2">PCI-DSS Level 1 & SOC2 (Fintech/Banking)</option>
                <option value="FedRAMP Moderate Ready">FedRAMP Moderate Ready (Government/Public Sector)</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Strict multi-tenant boundaries verified</span>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                {settingsSaved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Updated!
                  </>
                ) : (
                  <>Save Telemetry</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Security & Isolation Architecture Card */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Data Isolation & Zero-Leakage Architecture
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-nexus-950/60 border border-white/5 space-y-1">
                <div className="font-semibold text-slate-200 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  PostgreSQL Row Level Security (RLS)
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  All queries execute with <code>organization_id</code> binding. Cross-tenant leakage is cryptographically prevented at database connection pool levels.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-nexus-950/60 border border-white/5 space-y-1">
                <div className="font-semibold text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  AI Model Boundary (@google/genai)
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Gemini 2.5 Flash operates in stateless enterprise inference mode. Proprietary context is never utilized to train shared foundation weights.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Gemini API Key: <span className="font-mono text-indigo-300">{customApiKey ? "Custom Client Key" : "Server Environment Default"}</span>
            </span>
            <button
              onClick={onOpenApiKeyModal}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Configure Key
            </button>
          </div>
        </div>
      </div>

      {/* RBAC Member Directory Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Role-Based Access Control (RBAC) User Directory
            </h3>
            <p className="text-[11px] text-slate-400">
              Employees provisioned within the current enterprise organization boundary.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {members.length} Provisioned Accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-nexus-900/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Corporate Email</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Provisioned Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-200 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white">
                      {member.full_name.charAt(0)}
                    </div>
                    <span>{member.full_name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                    {member.email}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {member.department || "General"}
                  </td>
                  <td className="py-3.5 px-4">
                    {getRoleBadge(member.role)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                    {new Date(member.created_at).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 relative border border-white/10 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Onboard New Team Member</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add a corporate user with designated department and RBAC security role.
            </p>

            {inviteSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {inviteSuccess}
              </div>
            )}

            <form onSubmit={handleInvite} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Lee"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="jordan.lee@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Department
                </label>
                <select
                  value={inviteDept}
                  onChange={(e) => setInviteDept(e.target.value)}
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs bg-nexus-900"
                >
                  <option value="Legal & Compliance">Legal & Compliance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Operations & Supply Chain">Operations & Supply Chain</option>
                  <option value="Executive Leadership">Executive Leadership</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Role Assignment
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as "admin" | "employee")}
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs bg-nexus-900"
                >
                  <option value="employee">Employee (Copilot & Knowledge Hub access)</option>
                  <option value="admin">Administrator (Workflow management & Ingestion)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow transition-all disabled:opacity-50"
                >
                  {isInviting ? "Onboarding..." : "Confirm & Provision"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
