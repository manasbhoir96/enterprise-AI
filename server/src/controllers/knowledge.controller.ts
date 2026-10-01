import type { Request, Response } from "express";
import { query } from "../db/index.js";
import { summarizeDocument } from "../services/gemini.service.js";
import type { IngestKnowledgeInput } from "@nexusai/shared";

export async function listKnowledge(req: Request, res: Response): Promise<void> {
  const orgId = req.user!.organization_id;
  const { department, search } = req.query;

  try {
    let sql = `
      SELECT k.id, k.organization_id, k.uploaded_by, k.title, k.content_text,
             k.department_tag, k.classification, k.created_at,
             u.full_name as uploader_name
      FROM knowledge_assets k
      JOIN users u ON k.uploaded_by = u.id
      WHERE k.organization_id = $1
    `;
    const params: any[] = [orgId];

    if (department && department !== "All") {
      params.push(department);
      sql += ` AND k.department_tag = $${params.length}`;
    }

    if (search && typeof search === "string" && search.trim().length > 0) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(k.title) LIKE $${params.length} OR LOWER(k.content_text) LIKE $${params.length})`;
    }

    sql += " ORDER BY k.created_at DESC";

    const result = await query(sql, params);
    res.json({ assets: result.rows });
  } catch (error) {
    console.error("List knowledge error:", error);
    res.status(500).json({ error: "Failed to fetch knowledge assets" });
  }
}

export async function ingestKnowledge(req: Request, res: Response): Promise<void> {
  const orgId = req.user!.organization_id;
  const userId = req.user!.id;
  const { title, contentText, departmentTag, classification } = req.body as IngestKnowledgeInput;

  try {
    // Generate AI summary for quick preview
    const customKey = (req.headers["x-gemini-key"] as string) || undefined;
    const summary = await summarizeDocument(contentText, customKey);

    const result = await query(
      `INSERT INTO knowledge_assets 
       (organization_id, uploaded_by, title, content_text, department_tag, classification)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, organization_id, uploaded_by, title, department_tag, classification, created_at`,
      [orgId, userId, title, contentText, departmentTag, classification]
    );

    const asset = result.rows[0];
    res.status(201).json({
      message: "Knowledge asset ingested and indexed successfully",
      asset: {
        ...asset,
        uploader_name: req.user!.full_name,
        summary,
      },
    });
  } catch (error) {
    console.error("Ingest knowledge error:", error);
    res.status(500).json({ error: "Failed to ingest knowledge asset" });
  }
}

export async function deleteKnowledge(req: Request, res: Response): Promise<void> {
  const orgId = req.user!.organization_id;
  const { id } = req.params;

  try {
    const result = await query(
      "DELETE FROM knowledge_assets WHERE id = $1 AND organization_id = $2 RETURNING id",
      [id, orgId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Knowledge asset not found or access denied" });
      return;
    }

    res.json({ message: "Knowledge asset removed successfully", id });
  } catch (error) {
    console.error("Delete knowledge error:", error);
    res.status(500).json({ error: "Failed to delete knowledge asset" });
  }
}
