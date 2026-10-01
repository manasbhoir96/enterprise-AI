import { z } from "zod";
export declare const RegisterTenantSchema: z.ZodObject<{
    organizationName: z.ZodString;
    industry: z.ZodString;
    adminEmail: z.ZodString;
    adminPassword: z.ZodString;
    fullName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    organizationName: string;
    industry: string;
    adminEmail: string;
    adminPassword: string;
    fullName: string;
}, {
    organizationName: string;
    industry: string;
    adminEmail: string;
    adminPassword: string;
    fullName: string;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const IngestKnowledgeSchema: z.ZodObject<{
    title: z.ZodString;
    contentText: z.ZodString;
    departmentTag: z.ZodString;
    classification: z.ZodEnum<["public", "internal", "confidential", "restricted"]>;
}, "strip", z.ZodTypeAny, {
    title: string;
    contentText: string;
    departmentTag: string;
    classification: "public" | "internal" | "confidential" | "restricted";
}, {
    title: string;
    contentText: string;
    departmentTag: string;
    classification: "public" | "internal" | "confidential" | "restricted";
}>;
export declare const ExecuteWorkflowSchema: z.ZodObject<{
    workflowId: z.ZodString;
    inputData: z.ZodString;
}, "strip", z.ZodTypeAny, {
    workflowId: string;
    inputData: string;
}, {
    workflowId: string;
    inputData: string;
}>;
export declare const CreateWorkflowSchema: z.ZodObject<{
    name: z.ZodString;
    systemPrompt: z.ZodString;
    targetDepartment: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    systemPrompt: string;
    targetDepartment: string;
}, {
    name: string;
    systemPrompt: string;
    targetDepartment: string;
}>;
export declare const CopilotQuerySchema: z.ZodObject<{
    query: z.ZodString;
    departmentContext: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    query: string;
    departmentContext?: string | undefined;
}, {
    query: string;
    departmentContext?: string | undefined;
}>;
export declare const InviteMemberSchema: z.ZodObject<{
    email: z.ZodString;
    fullName: z.ZodString;
    department: z.ZodString;
    role: z.ZodEnum<["admin", "employee"]>;
}, "strip", z.ZodTypeAny, {
    fullName: string;
    email: string;
    department: string;
    role: "admin" | "employee";
}, {
    fullName: string;
    email: string;
    department: string;
    role: "admin" | "employee";
}>;
export type RegisterTenantInput = z.infer<typeof RegisterTenantSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type IngestKnowledgeInput = z.infer<typeof IngestKnowledgeSchema>;
export type ExecuteWorkflowInput = z.infer<typeof ExecuteWorkflowSchema>;
export type CreateWorkflowInput = z.infer<typeof CreateWorkflowSchema>;
export type CopilotQueryInput = z.infer<typeof CopilotQuerySchema>;
export type InviteMemberInput = z.infer<typeof InviteMemberSchema>;
//# sourceMappingURL=enterprise.d.ts.map