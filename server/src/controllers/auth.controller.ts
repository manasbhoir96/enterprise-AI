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
      // 1. Create Organization
      const orgRes = await client.query(
        "INSERT INTO organizations (name, industry) VALUES ($1, $2) RETURNING id, name, industry, created_at",
        [organizationName, industry]
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

      return { org, user };
    });

    const token = generateToken({
      userId: result.user.id,
      organizationId: result.org.id,
    });

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
              o.name as org_name, o.industry
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
