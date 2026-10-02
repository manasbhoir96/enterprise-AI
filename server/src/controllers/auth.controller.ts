import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { query, transaction } from "../db/index.js";
import { generateToken } from "../middleware/auth.js";
import type { RegisterTenantInput, LoginInput } from "@nexusai/shared";

export async function registerTenant(req: Request, res: Response): Promise<void> {
  const { organizationName, industry, adminEmail, adminPassword, fullName } = req.body as RegisterTenantInput;

  try {
    // Check if user already exists
    const existing = await query("SELECT id FROM users WHERE email = $1", [adminEmail.toLowerCase()]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: "An account with this email address already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const result = await transaction(async (client) => {
      // 1. Create Organization with sovereign API Key
      const apiKey = "nx_live_" + Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(2, 14);
      const orgRes = await client.query(
        "INSERT INTO organizations (name, industry, api_key) VALUES ($1, $2, $3) RETURNING id, name, industry, api_key, created_at",
        [organizationName, industry, apiKey]
      );
      const org = orgRes.rows[0];

      // 2. Create Initial Owner User
      const userRes = await client.query(
        `INSERT INTO users (organization_id, email, password_hash, full_name, department, role)
         VALUES ($1, $2, $3, $4, $5, 'owner')
         RETURNING id, organization_id, email, full_name, department, role, created_at`,
        [org.id, adminEmail.toLowerCase(), passwordHash, fullName, "Executive Leadership"]
      );
      const user = userRes.rows[0];

      // 3. Create default AI workflows for the organization
      await client.query(
        `INSERT INTO ai_workflows (organization_id, created_by, name, system_prompt, target_department)
         VALUES 
         ($1, $2, 'Enterprise Contract Risk Analyzer', 'Execute rigorous contractual risk analysis, identifying indemnity exposure, liability caps, and termination penalties.', 'Legal & Compliance'),
         ($1, $2, 'Quarterly Financial Health Synthesizer', 'Synthesize financial statements, budget variances, and cost anomalies for executive quarterly review.', 'Finance & Accounting'),
         ($1, $2, 'HR Policy & Onboarding Assistant', 'Verify departmental compliance, employee leave provisions, and corporate code of conduct adherence.', 'Human Resources')`,
        [org.id, user.id]
      );

      // 4. Create default Knowledge Assets for the organization so Gemini API key immediately accesses data
      await client.query(
        `INSERT INTO knowledge_assets (organization_id, uploaded_by, title, content_text, department_tag, classification)
         VALUES 
         ($1, $2, $3 || ' Enterprise AI Governance & Operating Charter', 'SOVEREIGN ENTERPRISE AI GOVERNANCE CHARTER\n\n1. SCOPE & OBJECTIVES\nAll autonomous workflows operate strictly within ' || $3 || ' sovereign tenant boundaries with zero data cross-leakage.\n\n2. COMPLIANCE & PRIVACY\nData is encrypted under SOC2 Type II protocols with cryptographic tenant isolation. Internal queries are processed with audit logging.\n\n3. EXPENDITURE CONTROLS\nAutomated actions exceeding $25,000 require manual sign-off from authorized personnel.', 'Executive Leadership', 'internal'),
         ($1, $2, $3 || ' Master Services & Vendor Terms', 'MASTER SERVICES AGREEMENT (MSA)\n\nCLAUSE 5: INDEMNIFICATION & LIABILITY\n' || $3 || ' holds comprehensive mutual indemnification with liability capped at 12 months fees.\n\nCLAUSE 8: SERVICE AVAILABILITY\nVendor commits to 99.95% system uptime measured on a monthly basis.', 'Legal & Compliance', 'confidential'),
         ($1, $2, $3 || ' Corporate Expense & Travel Policy', 'TRAVEL & EXPENSE REIMBURSEMENT POLICY\n\n1. Air travel: Standard corporate travel is economy class for domestic flights under 5 hours. Business class authorized for international travel exceeding 6 hours with VP approval.\n2. Meals: Daily per diem allowance is $80/day ($20 breakfast, $25 lunch, $35 dinner).\n3. Lodging: Maximum room rate is $250/night for Tier 1 cities.', 'Finance & Accounting', 'internal')`,
        [org.id, user.id, organizationName]
      );

      return { org, user };
    });

    const token = generateToken({
      userId: result.user.id,
      organizationId: result.org.id,
    });

    // 5. Dual-sync account to Supabase Cloud Auth
    try {
      const { supabase } = await import("../lib/supabase.js");
      if (supabase) {
        await supabase.auth.admin.createUser({
          email: adminEmail.toLowerCase(),
          password: adminPassword,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            organization: organizationName,
            industry: industry,
            role: "owner",
          },
        });
        console.log(`☁️ Synced ${adminEmail} to Supabase Auth Cloud`);
      }
    } catch (sbErr: any) {
      console.warn("Supabase auth sync notice:", sbErr?.message || sbErr);
    }

    res.status(201).json({
      message: "Organization registered successfully",
      token,
      user: result.user,
      organization: result.org,
    });
  } catch (error) {
    console.error("Register tenant error:", error);
    res.status(500).json({ error: "Failed to register enterprise organization" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as LoginInput;

  try {
    const userRes = await query(
      `SELECT u.id, u.organization_id, u.email, u.password_hash, u.full_name, u.department, u.role,
              o.name as org_name, o.industry, o.api_key
       FROM users u
       JOIN organizations o ON u.organization_id = o.id
       WHERE LOWER(u.email) = LOWER($1)`,
      [email]
    );

    if (userRes.rows.length === 0) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const user = userRes.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = generateToken({
      userId: user.id,
      organizationId: user.organization_id,
    });

    const { password_hash, ...safeUser } = user;

    res.json({
      message: "Login successful",
      token,
      user: safeUser,
      organization: {
        id: user.organization_id,
        name: user.org_name,
        industry: user.industry,
        api_key: user.api_key,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error during login" });
  }
}

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({ user: req.user });
}
