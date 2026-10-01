import { query } from "../db/index.js";
import { executeCopilotQuery } from "../services/gemini.service.js";
export async function queryCopilot(req, res) {
    const orgId = req.user.organization_id;
    const orgName = req.user.org_name || "Enterprise";
    const { query: userQuery, departmentContext } = req.body;
    const customApiKey = req.headers["x-gemini-key"] || undefined;
    try {
        // 1. Fetch relevant knowledge assets for this organization
        let sql = `
      SELECT id, title, content_text, department_tag, classification
      FROM knowledge_assets
      WHERE organization_id = $1
    `;
        const params = [orgId];
        if (departmentContext && departmentContext !== "All") {
            params.push(departmentContext);
            sql += ` AND department_tag = $${params.length}`;
        }
        sql += " ORDER BY created_at DESC LIMIT 15";
        const assetsRes = await query(sql, params);
        const allAssets = assetsRes.rows;
        // Rank assets based on query keyword matches
        const searchTerms = userQuery
            .toLowerCase()
            .split(/\s+/)
            .filter((w) => w.length > 2);
        const scoredAssets = allAssets.map((asset) => {
            const text = (asset.title + " " + asset.content_text).toLowerCase();
            let score = 0;
            for (const term of searchTerms) {
                if (text.includes(term)) {
                    score += 1;
                }
            }
            return { asset, score };
        });
        // Sort by score descending; take top 5
        scoredAssets.sort((a, b) => b.score - a.score);
        const topChunks = scoredAssets.slice(0, 5).map((item) => ({
            id: item.asset.id,
            title: item.asset.title,
            content: item.asset.content_text,
            department: item.asset.department_tag,
            classification: item.asset.classification,
        }));
        // 2. Synthesize via Gemini / RAG engine
        const copilotResult = await executeCopilotQuery({
            query: userQuery,
            departmentContext,
            organizationName: orgName,
            knowledgeChunks: topChunks,
            customApiKey,
        });
        res.json(copilotResult);
    }
    catch (error) {
        console.error("Copilot query error:", error);
        res.status(500).json({ error: "Failed to generate copilot response" });
    }
}
