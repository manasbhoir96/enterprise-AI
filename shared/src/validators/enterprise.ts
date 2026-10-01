import { z } from "zod";

export const RegisterTenantSchema = z.object({
  organizationName: z.string().min(2).max(150),
  industry: z.string().min(2),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(8, "Password must be at least 8 characters long"),
  fullName: z.string().min(2),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const IngestKnowledgeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  contentText: z.string().min(50, "Document must contain substantial text for AI processing"),
  departmentTag: z.string().min(2, "Department tag is required"),
  classification: z.enum(["public", "internal", "confidential", "restricted"]),
});

export const ExecuteWorkflowSchema = z.object({
  workflowId: z.string().uuid("Invalid Workflow UUID"),
  inputData: z.string().min(10, "Input payload must be at least 10 characters"),
});

export const CreateWorkflowSchema = z.object({
  name: z.string().min(3).max(150),
  systemPrompt: z.string().min(20, "System prompt must be descriptive"),
  targetDepartment: z.string().min(2),
});

export const CopilotQuerySchema = z.object({
  query: z.string().min(2, "Query is too short"),
  departmentContext: z.string().optional(),
});

export const InviteMemberSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  department: z.string().min(2),
  role: z.enum(["admin", "employee"]),
});

export type RegisterTenantInput = z.infer<typeof RegisterTenantSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type IngestKnowledgeInput = z.infer<typeof IngestKnowledgeSchema>;
export type ExecuteWorkflowInput = z.infer<typeof ExecuteWorkflowSchema>;
export type CreateWorkflowInput = z.infer<typeof CreateWorkflowSchema>;
export type CopilotQueryInput = z.infer<typeof CopilotQuerySchema>;
export type InviteMemberInput = z.infer<typeof InviteMemberSchema>;
