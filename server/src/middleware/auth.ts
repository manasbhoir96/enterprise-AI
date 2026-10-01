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
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    res.status(401).json({ error: "Authentication token missing or invalid" });
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
              o.name as org_name, o.industry
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
