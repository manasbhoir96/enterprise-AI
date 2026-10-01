export type UserRole = "owner" | "admin" | "employee";
export type DataClassification = "public" | "internal" | "confidential" | "restricted";
export type WorkflowStatus = "idle" | "processing" | "completed" | "failed";

export interface Organization {
  id: string;
  name: string;
  industry: string | null;
  api_key?: string;
  created_at: string;
}

export interface User {
  id: string;
  organization_id: string;
  email: string;
  full_name: string;
  department: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeAsset {
  id: string;
  organization_id: string;
  uploaded_by: string;
  title: string;
  content_text: string;
  department_tag: string | null;
  classification: DataClassification;
  created_at: string;
  uploader_name?: string;
  summary?: string;
}

export interface AIWorkflow {
  id: string;
  organization_id: string;
  created_by: string;
  name: string;
  system_prompt: string;
  target_department: string | null;
  created_at: string;
  creator_name?: string;
  execution_count?: number;
}

export interface IdentifiedRisk {
  riskType: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  remediationAction: string;
}

export interface ComplianceCheck {
  requirement: string;
  status: "PASS" | "FAIL" | "NEEDS_REVIEW";
}

export interface RiskReportResponse {
  executiveSummary: string;
  overallRiskScore: number;
  identifiedRisks: IdentifiedRisk[];
  complianceChecklist: ComplianceCheck[];
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  executed_by: string;
  status: WorkflowStatus;
  input_payload: {
    inputData: string;
    organizationName?: string;
    industry?: string;
    classification?: string;
    [key: string]: any;
  };
  ai_response: RiskReportResponse | Record<string, any> | null;
  execution_time_ms: number | null;
  created_at: string;
  workflow_name?: string;
  executor_name?: string;
}

export interface CopilotCitation {
  id: string;
  title: string;
  departmentTag: string | null;
  classification: DataClassification;
  snippet: string;
}

export interface CopilotQueryResponse {
  answer: string;
  citations: CopilotCitation[];
  modelUsed: string;
  executionTimeMs: number;
}

export interface DashboardMetrics {
  totalWorkflowsRun: number;
  activeDepartments: number;
  totalKnowledgeAssets: number;
  estimatedHoursSaved: number;
  estimatedCostSavings: number;
  systemHealth: "Optimal" | "Degraded" | "Maintenance";
  recentExecutions: WorkflowExecution[];
  departmentBreakdown: { department: string; count: number }[];
  complianceRate: number;
}
