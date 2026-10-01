import { Router } from "express";
import {
  getOrgOverview,
  listOrgMembers,
  inviteOrgMember,
  updateOrgSettings,
  getDatabaseStatusHandler,
  testDatabaseHandler,
  migrateDatabaseHandler,
  getShareInfoHandler,
} from "../controllers/org.controller.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { validateBody } from "../middleware/validate.js";
import { InviteMemberSchema } from "@nexusai/shared";

const router = Router();

router.use(authenticateToken);

router.get("/overview", getOrgOverview);
router.get("/members", listOrgMembers);
router.post("/members", requireRole(["owner", "admin"]), validateBody(InviteMemberSchema), inviteOrgMember);
router.patch("/settings", requireRole(["owner", "admin"]), updateOrgSettings);
router.get("/database-status", getDatabaseStatusHandler);
router.post("/test-database", testDatabaseHandler);
router.post("/migrate-database", migrateDatabaseHandler);
router.get("/share-info", getShareInfoHandler);

export default router;
