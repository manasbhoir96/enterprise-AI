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

interface TenantAdminPageProps {}

export const TenantAdminPage: React.FC<TenantAdminPageProps> = () => {
  const { user, organization } = useAuth();
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
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gold-100 text-gold-950 border border-gold-400 font-mono shadow-2xs">MANAGING PARTNER</span>;
      case "admin":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-900 border border-amber-300 font-mono shadow-2xs">OFFICER / ADMIN</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800 border border-slate-300 font-mono shadow-2xs">ASSOCIATE</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl glass-panel border border-[#00E5FF]/25 shadow-[0_0_35px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute inset-0 hologram-laser-sweep pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-lg font-bold font-quant text-white tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00FFA3]" />
            Institutional Governance & Capital Access
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Fiduciary oversight, multi-tenant RBAC delegations, and regulatory compliance telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 relative z-10">
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-5 py-2.5 rounded-xl bull-market-btn text-[#050811] font-bold text-xs font-quant transition-all flex items-center gap-1.5 hover:scale-105"
          >
            <UserPlus className="w-4 h-4 text-[#050811]" />
            + Induct Enterprise Officer
          </button>
        </div>
      </div>

      {/* Grid: Tenant Telemetry + AI Governance Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Organization Telemetry Form */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gold-300/80 shadow-luxuryCard space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gold-200/80">
            <h3 className="text-sm font-bold text-slate-900 font-serif-luxury flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gold-700" />
              Sovereign Entity Profile & Metadata
            </h3>
            <span className="text-[10px] font-mono text-gold-900 font-bold px-2 py-0.5 rounded bg-gold-50 border border-gold-200">
              TENANT: {organization?.id.substring(0, 8)}...
            </span>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-serif mb-1">
                Chartered Legal Entity
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FCFBF8] text-slate-900 border border-gold-300/80 focus:outline-none focus:border-gold-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-serif mb-1">
                Primary Financial Sector
              </label>
              <input
                type="text"
                value={orgIndustry}
                onChange={(e) => setOrgIndustry(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FCFBF8] text-slate-900 border border-gold-300/80 focus:outline-none focus:border-gold-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-serif mb-1">
                Mandated Statutory Standard
              </label>
              <select
                value={complianceLevel}
                onChange={(e) => setComplianceLevel(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FCFBF8] text-slate-900 border border-gold-300/80 focus:outline-none focus:border-gold-500 shadow-2xs font-medium cursor-pointer"
              >
                <option value="SOC2 Type II & HIPAA">SOC2 Type II & HIPAA (Healthcare/Cloud)</option>
                <option value="SOC2 Type II & ISO 27001">SOC2 Type II & ISO 27001 (Enterprise SaaS)</option>
                <option value="PCI-DSS Level 1 & SOC2">PCI-DSS Level 1 & SOC2 (Fintech/Banking)</option>
                <option value="FedRAMP Moderate Ready">FedRAMP Moderate Ready (Government/Public Sector)</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Cryptographic tenant boundaries enforced</span>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl gold-foil-btn text-white font-bold text-xs shadow-goldSoft transition-all flex items-center gap-1.5 hover:scale-105"
              >
                {settingsSaved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    Ledger Updated!
                  </>
                ) : (
                  <>Commit Changes</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Security & Enterprise Governance Card */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gold-300/80 shadow-luxuryCard flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gold-200/80 mb-3">
              <h3 className="text-sm font-bold text-slate-900 font-serif-luxury flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-700" />
                Institutional Security & RLS Isolation
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 uppercase tracking-wider font-mono">
                COMPLIANT & AUDITED
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#FCFBF8] border border-gold-200/80 space-y-1.5 shadow-2xs">
                <div className="font-bold text-slate-900 font-serif flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Multi-Tenant Cryptographic Partitioning
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Every document, AI prompt session, and workflow record is strictly bound to your organization's sovereign ID with Row-Level Security.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FCFBF8] border border-gold-200/80 space-y-1.5 shadow-2xs">
                <div className="font-bold text-slate-900 font-serif flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-700" />
                  Zero-Leak AI Pipeline (Gemini 3.8 Flash)
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  High-throughput reasoning executes exclusively through an isolated backend tunnel. Enterprise data is never retained for public model training.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gold-100 flex items-center justify-between">
            <span className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Role-Based Access Control (RBAC) Active
            </span>
            <span className="text-[10px] font-mono text-gold-900 bg-gold-50 px-2.5 py-1 rounded-md border border-gold-200 font-bold shadow-2xs">
              SOC2 TYPE II VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* RBAC Member Directory Table */}
      <div className="rounded-3xl overflow-hidden bg-white border border-gold-300/80 shadow-luxuryCard">
        <div className="p-5 border-b border-gold-200/80 bg-[#FCFBF8] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-serif-luxury tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-gold-700" />
              Corporate Access Registry & Officer Directory
            </h3>
            <p className="text-[11px] text-slate-500">
              Authorized personnel provisioned within the sovereign enterprise tenant partition.
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-gold-50 border border-gold-300 text-gold-900 shadow-2xs">
            {members.length} Provisioned Accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-gold-200 font-serif">
              <tr>
                <th className="py-3.5 px-4">Executive / Officer</th>
                <th className="py-3.5 px-4">Corporate Email</th>
                <th className="py-3.5 px-4">Jurisdiction</th>
                <th className="py-3.5 px-4">Security Role</th>
                <th className="py-3.5 px-4">Induction Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gold-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2.5 font-serif">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-600 to-amber-700 flex items-center justify-center text-[11px] font-bold text-white shadow-2xs">
                      {member.full_name.charAt(0)}
                    </div>
                    <span>{member.full_name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                    {member.email}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {member.department || "General"}
                  </td>
                  <td className="py-3.5 px-4">
                    {getRoleBadge(member.role)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 relative border border-gold-300 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 font-serif-luxury mb-1">Induct Corporate Officer</h3>
            <p className="text-xs text-slate-500 mb-4">
              Grant authenticated access with departmental boundary and RBAC privilege level.
            </p>

            {inviteSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {inviteSuccess}
              </div>
            )}

            <form onSubmit={handleInvite} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-serif mb-1">
                  Full Name & Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Lee"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FCFBF8] text-slate-900 border border-gold-300/80 focus:outline-none focus:border-gold-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-serif mb-1">
                  Institutional Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="jordan.lee@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FCFBF8] text-slate-900 border border-gold-300/80 focus:outline-none focus:border-gold-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-serif mb-1">
                  Primary Jurisdiction / Dept
                </label>
                <select
                  value={inviteDept}
                  onChange={(e) => setInviteDept(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FCFBF8] text-slate-900 border border-gold-300/80 focus:outline-none focus:border-gold-500 shadow-2xs font-medium cursor-pointer"
                >
                  <option value="Legal & Compliance">Legal & Compliance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Operations & Supply Chain">Operations & Supply Chain</option>
                  <option value="Executive Leadership">Executive Leadership</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-serif mb-1">
                  RBAC Role Authorization
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as "admin" | "employee")}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FCFBF8] text-slate-900 border border-gold-300/80 focus:outline-none focus:border-gold-500 shadow-2xs font-medium cursor-pointer"
                >
                  <option value="employee">Associate (Copilot Inquiries & Vault Access)</option>
                  <option value="admin">Managing Officer (Workflow Audit & Document Deposition)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-gold-50 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="px-5 py-2.5 rounded-xl gold-foil-btn text-white font-bold text-xs shadow-goldSoft transition-all disabled:opacity-50 hover:scale-105"
                >
                  {isInviting ? "Inducting..." : "Provision Credentials"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
