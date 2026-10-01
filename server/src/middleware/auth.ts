import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { query } from "../db/index.js";
import type { UserRole } from "@nexusai/shared";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_enterprise_jwt_key_change_in_production";

export interface AuthenticatedUser {
  id: string;
  organization_id: string;
  email: string;
  full_name: string;
  department: string | null;
  role: UserRole;
  org_name?: string;
  industry?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers["authorization"];
  const apiKeyHeader = (req.headers["x-api-key"] as string) || (req.headers["x-enterprise-key"] as string);

  // 1. Support API Key authentication (x-api-key header or Authorization: ApiKey <key> or Authorization: Bearer nx_live_...)
  const apiKey =
    apiKeyHeader ||
    (authHeader && authHeader.startsWith("ApiKey ") ? authHeader.split(" ")[1] : null) ||
    (authHeader && authHeader.startsWith("Bearer nx_live_") ? authHeader.split(" ")[1] : null);

  if (apiKey) {
    try {
      const cleanKey = apiKey.trim();
      const orgRes = await query(
        `SELECT u.id, u.organization_id, u.email, u.full_name, u.department, u.role,
                o.name as org_name, o.industry
         FROM users u
         JOIN organizations o ON u.organization_id = o.id
         WHERE o.api_key = $1 OR o.id::text = $1
         ORDER BY CASE WHEN u.role = 'owner' THEN 0 WHEN u.role = 'admin' THEN 1 ELSE 2 END
         LIMIT 1`,
        [cleanKey]
      );

      if (orgRes.rows.length > 0) {
        req.user = orgRes.rows[0];
        return next();
      }
    } catch (err) {
      console.error("API Key auth error:", err);
    }
  }

  // 2. Support Standard JWT Bearer token authentication
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    res.status(401).json({ error: "Authentication required. Provide a valid Bearer token or x-api-key header." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      organizationId: string;
    };

    // Fetch user and organization to guarantee up-to-date role and tenant binding
    const userRes = await query(
      `SELECT u.id, u.organization_id, u.email, u.full_name, u.department, u.role,
              o.name as org_name, o.industry, o.api_key as org_api_key
       FROM users u
       JOIN organizations o ON u.organization_id = o.id
       WHERE u.id = $1 AND u.organization_id = $2`,
      [decoded.userId, decoded.organizationId]
    );

    if (userRes.rows.length === 0) {
      res.status(403).json({ error: "Access denied: User or tenant no longer exists" });
      return;
    }

    req.user = userRes.rows[0];
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired authentication token" });
  }
}

export function generateToken(payload: { userId: string; organizationId: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}
